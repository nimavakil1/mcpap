import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import OpenAI from 'openai';

const BATCH_SIZE = 10; // Process 10 products at a time

// Initialize OpenAI client
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

// Generate description using GPT-4
async function generateDescription(openai: OpenAI, product: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein professioneller Produktbeschreibungs-Autor für einen Büroartikel-Onlineshop. Schreibe SEO-optimierte, verkaufsfördernde Produktbeschreibungen auf Deutsch. Die Beschreibung sollte 2-3 Sätze lang sein und die wichtigsten Produktmerkmale hervorheben.'
        },
        {
          role: 'user',
          content: `Schreibe eine professionelle Produktbeschreibung für:
Produkt: ${product.title}
Marke: ${product.brand}
Kategorie: ${product.category}
EAN: ${product.ean}`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI error:', error);
    return '';
  }
}

// Scrape image from DuckDuckGo (free)
async function scrapeImage(query: string): Promise<string | null> {
  try {
    // Use DuckDuckGo image search
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;

    // First, get the vqd token
    const tokenResponse = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await tokenResponse.text();
    const vqdMatch = html.match(/vqd=["']?([^"'&]+)/);
    if (!vqdMatch) return null;

    const vqd = vqdMatch[1];

    // Now search for images
    const imageApiUrl = `https://duckduckgo.com/i.js?l=wt-wt&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`;

    const imageResponse = await fetch(imageApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    const imageData = await imageResponse.json();

    if (imageData.results && imageData.results.length > 0) {
      // Return the first image URL
      return imageData.results[0].image;
    }

    return null;
  } catch (error) {
    console.error('Image scrape error:', error);
    return null;
  }
}

// Download and save image
async function downloadImage(imageUrl: string, productId: string, index: number): Promise<string | null> {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';
    let extension = 'jpg';
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('gif')) extension = 'gif';

    const buffer = await response.arrayBuffer();

    // Create directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products', productId);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filename = `${Date.now()}-${index}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, Buffer.from(buffer));

    return `/uploads/products/${productId}/${filename}`;
  } catch (error) {
    console.error('Download image error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { offset = 0, generateDescriptions = true, fetchImages = true } = body;

    // Read the uploaded Excel file
    const filePath = path.join(process.cwd(), 'tmp', 'import.xlsx');
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Keine Datei hochgeladen. Bitte zuerst Datei hochladen.' }, { status: 400 });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const allData = XLSX.utils.sheet_to_json(sheet) as any[];

    const totalProducts = allData.length;
    const batch = allData.slice(offset, offset + BATCH_SIZE);

    if (batch.length === 0) {
      return NextResponse.json({
        success: true,
        completed: true,
        processed: 0,
        total: totalProducts,
        message: 'Import abgeschlossen!'
      });
    }

    const openai = generateDescriptions ? getOpenAI() : null;
    const results: { success: number; failed: number; errors: string[] } = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const row of batch) {
      try {
        // Map columns
        const productData = {
          sku: String(row['Product Number'] || ''),
          ean: String(row['Product Barcode'] || ''),
          name: String(row['Product Title4'] || ''),
          manufacturer: String(row['Product Brand Name'] || ''),
          manufacturerSku: String(row['Product Model'] || ''),
          categoryName: String(row['Product Group Name'] || ''),
          categoryCode: String(row['Product Group Code'] || ''),
          stockQuantity: parseInt(row['Stock Count']) || 0,
          minimumOrderQuantity: parseInt(row[' MOQ'] || row['MOQ']) || 1,
          basePrice: parseFloat(String(row[' Retail Price'] || row['Retail Price'] || '0').replace(',', '.')) || 0,
          taxRate: parseFloat(String(row[' VAT Rate Percentage'] || row['VAT Rate Percentage'] || '19')) || 19,
        };

        if (!productData.sku || !productData.name) {
          results.failed++;
          results.errors.push(`Zeile übersprungen: SKU oder Name fehlt`);
          continue;
        }

        // Find or create category
        let category = await prisma.category.findFirst({
          where: { name: productData.categoryName }
        });

        if (!category && productData.categoryName) {
          const slug = productData.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          category = await prisma.category.create({
            data: {
              name: productData.categoryName,
              slug: slug || `category-${Date.now()}`,
              isActive: true,
            }
          });
        }

        // Generate description with OpenAI
        let description = '';
        if (openai) {
          description = await generateDescription(openai, {
            title: productData.name,
            brand: productData.manufacturer,
            category: productData.categoryName,
            ean: productData.ean
          });
        }

        // Create product slug
        const slug = productData.name.toLowerCase()
          .replace(/[äÄ]/g, 'ae')
          .replace(/[öÖ]/g, 'oe')
          .replace(/[üÜ]/g, 'ue')
          .replace(/[ß]/g, 'ss')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .substring(0, 100);

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
          where: { sku: productData.sku }
        });

        let product;
        if (existingProduct) {
          product = await prisma.product.update({
            where: { sku: productData.sku },
            data: {
              name: productData.name,
              ean: productData.ean || null,
              description: description || existingProduct.description,
              manufacturer: productData.manufacturer || null,
              manufacturerSku: productData.manufacturerSku || null,
              categoryId: category?.id || null,
              basePrice: productData.basePrice,
              taxRate: productData.taxRate,
              stockQuantity: productData.stockQuantity,
              minimumOrderQuantity: productData.minimumOrderQuantity,
              isActive: true,
              isAvailableOnline: true,
            }
          });
        } else {
          product = await prisma.product.create({
            data: {
              sku: productData.sku,
              name: productData.name,
              slug: `${slug}-${productData.sku.toLowerCase()}`,
              ean: productData.ean || null,
              description: description || null,
              manufacturer: productData.manufacturer || null,
              manufacturerSku: productData.manufacturerSku || null,
              categoryId: category?.id || null,
              basePrice: productData.basePrice,
              taxRate: productData.taxRate,
              stockQuantity: productData.stockQuantity,
              minimumOrderQuantity: productData.minimumOrderQuantity,
              isActive: true,
              isAvailableOnline: true,
            }
          });
        }

        // Fetch and save image
        if (fetchImages && productData.ean) {
          const searchQuery = productData.ean;
          const imageUrl = await scrapeImage(searchQuery);

          if (imageUrl) {
            const savedPath = await downloadImage(imageUrl, product.id, 0);
            if (savedPath) {
              await prisma.productImage.create({
                data: {
                  productId: product.id,
                  url: savedPath,
                  altText: productData.name,
                  isPrimary: true,
                  sortOrder: 0,
                }
              });
            }
          }
        }

        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Fehler: ${error.message}`);
        console.error('Product import error:', error);
      }
    }

    const nextOffset = offset + BATCH_SIZE;
    const completed = nextOffset >= totalProducts;

    return NextResponse.json({
      success: true,
      completed,
      processed: results.success,
      failed: results.failed,
      errors: results.errors.slice(0, 5),
      nextOffset: completed ? null : nextOffset,
      total: totalProducts,
      progress: Math.min(100, Math.round((nextOffset / totalProducts) * 100)),
      message: completed
        ? `Import abgeschlossen! ${offset + results.success} Produkte importiert.`
        : `${results.success} Produkte verarbeitet. Fortschritt: ${Math.round((nextOffset / totalProducts) * 100)}%`
    });
  } catch (error: any) {
    console.error('Process error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
