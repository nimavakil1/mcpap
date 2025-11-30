import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId, imageId } = await params;

    // Verify image belongs to product
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Remove primary from all other images
    await prisma.productImage.updateMany({
      where: {
        productId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    // Set this image as primary
    await prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set primary error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
