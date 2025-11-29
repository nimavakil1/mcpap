import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_DURATION } from '@/lib/cache';

export async function GET() {
  try {
    // Try cache first
    const cached = await cacheGet(CACHE_KEYS.CATEGORIES);

    if (cached) {
      return NextResponse.json(cached);
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Build tree structure (only top-level categories with children)
    const categoryTree = categories
      .filter((cat) => !cat.parentId)
      .map((cat) => ({
        ...cat,
        children: categories.filter((child) => child.parentId === cat.id),
      }));

    // Cache the result
    await cacheSet(CACHE_KEYS.CATEGORIES, categoryTree, CACHE_DURATION.LONG);

    return NextResponse.json(categoryTree);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Kategorien' },
      { status: 500 }
    );
  }
}
