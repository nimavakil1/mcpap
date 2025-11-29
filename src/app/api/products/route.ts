import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_DURATION } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const manufacturer = searchParams.get('manufacturer');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');
    const bestseller = searchParams.get('bestseller');
    const newArrival = searchParams.get('newArrival');

    // Build cache key
    const cacheKey = CACHE_KEYS.PRODUCTS(
      page,
      JSON.stringify({
        categorySlug,
        search,
        sort,
        order,
        minPrice,
        maxPrice,
        manufacturer,
        inStock,
        featured,
        bestseller,
        newArrival,
      })
    );

    // Try cache first
    const cached = await cacheGet<{
      items: unknown[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>(cacheKey);

    if (cached) {
      return NextResponse.json(cached);
    }

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { ean: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice) {
      where.basePrice = { ...(where.basePrice as object), gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.basePrice = { ...(where.basePrice as object), lte: parseFloat(maxPrice) };
    }

    if (manufacturer) {
      where.manufacturer = manufacturer;
    }

    if (inStock === 'true') {
      where.stockQuantity = { gt: 0 };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (bestseller === 'true') {
      where.isBestseller = true;
    }

    if (newArrival === 'true') {
      where.isNewArrival = true;
    }

    // Build orderBy
    const orderBy: Record<string, string> = {};
    if (sort === 'price') {
      orderBy.basePrice = order;
    } else if (sort === 'newest') {
      orderBy.createdAt = 'desc';
    } else {
      orderBy.name = order;
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        attributes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const result = {
      items: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    // Cache the result
    await cacheSet(cacheKey, result, CACHE_DURATION.MEDIUM);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Produkte' },
      { status: 500 }
    );
  }
}
