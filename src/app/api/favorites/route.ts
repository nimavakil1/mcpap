import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.id },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Favoriten' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Produkt-ID erforderlich' }, { status: 400 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: session.id, productId } },
    });

    if (existing) {
      // Remove from favorites
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, action: 'removed' });
    }

    // Add to favorites
    await prisma.favorite.create({
      data: { userId: session.id, productId },
    });

    return NextResponse.json({ success: true, action: 'added' });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren der Favoriten' }, { status: 500 });
  }
}
