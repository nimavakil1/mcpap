import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei hochgeladen' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json({ error: 'Datei enthält keine Daten' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      return row;
    });

    let imported = 0;
    let updated = 0;
    const errors: string[] = [];

    if (type === 'products') {
      for (const row of rows) {
        try {
          if (!row.sku || !row.name) {
            errors.push(`Zeile übersprungen: SKU und Name sind erforderlich`);
            continue;
          }

          // Find category by slug
          let categoryId = null;
          if (row.categorySlug) {
            const category = await prisma.category.findUnique({
              where: { slug: row.categorySlug },
            });
            if (category) categoryId = category.id;
          }

          const existing = await prisma.product.findUnique({
            where: { sku: row.sku },
          });

          const slug = row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

          const data = {
            name: row.name,
            slug,
            ean: row.ean || null,
            shortDescription: row.shortDescription || null,
            description: row.description || null,
            manufacturer: row.manufacturer || null,
            basePrice: parseFloat(row.basePrice) || 0,
            taxRate: parseFloat(row.taxRate) || 19,
            stockQuantity: parseInt(row.stockQuantity) || 0,
            categoryId,
            isActive: row.isActive !== 'false',
            isAvailableOnline: true,
          };

          if (existing) {
            await prisma.product.update({
              where: { sku: row.sku },
              data,
            });
            updated++;
          } else {
            await prisma.product.create({
              data: { ...data, sku: row.sku },
            });
            imported++;
          }
        } catch (error: any) {
          errors.push(`Fehler bei SKU ${row.sku}: ${error.message}`);
        }
      }
    } else if (type === 'categories') {
      // First pass: create/update categories without parent
      for (const row of rows) {
        try {
          if (!row.name || !row.slug) {
            errors.push(`Zeile übersprungen: Name und Slug sind erforderlich`);
            continue;
          }

          const existing = await prisma.category.findUnique({
            where: { slug: row.slug },
          });

          // Find parent if specified
          let parentId = null;
          if (row.parentSlug) {
            const parent = await prisma.category.findUnique({
              where: { slug: row.parentSlug },
            });
            if (parent) parentId = parent.id;
          }

          const data = {
            name: row.name,
            description: row.description || null,
            parentId,
            sortOrder: parseInt(row.sortOrder) || 0,
            isActive: row.isActive !== 'false',
          };

          if (existing) {
            await prisma.category.update({
              where: { slug: row.slug },
              data,
            });
            updated++;
          } else {
            await prisma.category.create({
              data: { ...data, slug: row.slug },
            });
            imported++;
          }
        } catch (error: any) {
          errors.push(`Fehler bei Slug ${row.slug}: ${error.message}`);
        }
      }
    } else if (type === 'customers') {
      for (const row of rows) {
        try {
          if (!row.email || !row.firstName || !row.lastName) {
            errors.push(`Zeile übersprungen: Email, Vorname und Nachname sind erforderlich`);
            continue;
          }

          const existing = await prisma.user.findUnique({
            where: { email: row.email },
          });

          const data = {
            firstName: row.firstName,
            lastName: row.lastName,
            companyName: row.companyName || null,
            phone: row.phone || null,
            billingStreet: row.billingStreet || null,
            billingCity: row.billingCity || null,
            billingPostalCode: row.billingPostalCode || null,
          };

          if (existing) {
            await prisma.user.update({
              where: { email: row.email },
              data,
            });
            updated++;
          } else {
            // Generate customer number
            const random = Math.floor(100000 + Math.random() * 900000);
            const customerNumber = `MC-${random}`;

            // Create with default password (should be reset)
            const bcrypt = await import('bcryptjs');
            const passwordHash = await bcrypt.hash('changeme123', 12);

            await prisma.user.create({
              data: {
                ...data,
                email: row.email,
                passwordHash,
                customerNumber,
              },
            });
            imported++;
          }
        } catch (error: any) {
          errors.push(`Fehler bei Email ${row.email}: ${error.message}`);
        }
      }
    } else {
      return NextResponse.json({ error: 'Ungültiger Import-Typ' }, { status: 400 });
    }

    return NextResponse.json({
      success: errors.length === 0,
      imported,
      updated,
      errors,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
