import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_DURATION } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try cache first
    const cacheKey = CACHE_KEYS.PRODUCT(slug);
    const cached = await cacheGet(cacheKey);

    if (cached) {
      return NextResponse.json(cached);
    }

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        attributes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produkt nicht gefunden' },
        { status: 404 }
      );
    }

    // Check if product is in EAN exclusion list
    let isStoreOnly = !product.isAvailableOnline;
    if (product.ean) {
      const exclusion = await prisma.eanExclusion.findUnique({
        where: { ean: product.ean },
      });
      if (exclusion) {
        isStoreOnly = true;
      }
    }

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        images: {
          where: { isPrimary: true },
        },
      },
      take: 4,
    });

    const result = {
      ...product,
      isStoreOnly,
      relatedProducts,
    };

    // Cache the result
    await cacheSet(cacheKey, result, CACHE_DURATION.MEDIUM);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden des Produkts' },
      { status: 500 }
    );
  }
}
