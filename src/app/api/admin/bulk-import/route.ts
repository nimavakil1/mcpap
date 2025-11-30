import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
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
    const action = formData.get('action') as string;

    if (action === 'clear') {
      // Delete all product images first
      await prisma.productImage.deleteMany();
      // Delete all products
      await prisma.product.deleteMany();
      // Delete all categories
      await prisma.category.deleteMany();

      return NextResponse.json({
        success: true,
        message: 'Alle Produkte und Kategorien gelöscht'
      });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Save uploaded file temporarily
    const uploadDir = path.join(process.cwd(), 'tmp');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const buffer = await file.arrayBuffer();
    const filePath = path.join(uploadDir, 'import.xlsx');
    await writeFile(filePath, Buffer.from(buffer));

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet) as any[];

    return NextResponse.json({
      success: true,
      totalRows: data.length,
      sampleData: data.slice(0, 5),
      message: `${data.length} Produkte gefunden. Bereit zum Importieren.`
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all product images first (including files)
    const images = await prisma.productImage.findMany();
    for (const image of images) {
      if (image.url.startsWith('/uploads/')) {
        const filepath = path.join(process.cwd(), 'public', image.url);
        if (existsSync(filepath)) {
          const { unlink } = await import('fs/promises');
          await unlink(filepath).catch(() => {});
        }
      }
    }

    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    return NextResponse.json({
      success: true,
      message: 'Alle Produkte, Bilder und Kategorien gelöscht'
    });
  } catch (error: any) {
    console.error('Delete all error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
