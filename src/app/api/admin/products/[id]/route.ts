import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        sku: body.sku,
        ean: body.ean || null,
        slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        shortDescription: body.shortDescription || null,
        longDescription: body.longDescription || null,
        manufacturer: body.manufacturer || null,
        basePrice: body.basePrice,
        taxRate: body.taxRate,
        isAvailableOnline: body.isAvailableOnline,
        stockQuantity: body.stockQuantity,
        minimumOrderQuantity: body.minimumOrderQuantity,
        unitOfMeasure: body.unitOfMeasure,
        unitsPerPackage: body.unitsPerPackage || null,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        isBestseller: body.isBestseller,
        isNewArrival: body.isNewArrival,
        categoryId: body.categoryId || null,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
