import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await params;
    const { imageUrls } = await request.json();

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products', productId);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const savedImages: string[] = [];
    const existingCount = product.images.length;

    for (let i = 0; i < imageUrls.length && i < 3; i++) {
      const imageUrl = imageUrls[i];

      try {
        // Download the image
        const response = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!response.ok) {
          console.error(`Failed to download image: ${imageUrl}`);
          continue;
        }

        const contentType = response.headers.get('content-type') || '';
        let extension = 'jpg';
        if (contentType.includes('png')) extension = 'png';
        else if (contentType.includes('webp')) extension = 'webp';
        else if (contentType.includes('gif')) extension = 'gif';

        const buffer = await response.arrayBuffer();
        const filename = `${Date.now()}-${i}.${extension}`;
        const filepath = path.join(uploadsDir, filename);

        // Save the file
        await writeFile(filepath, Buffer.from(buffer));

        // Create database record
        const localUrl = `/uploads/products/${productId}/${filename}`;

        await prisma.productImage.create({
          data: {
            productId,
            url: localUrl,
            altText: product.name,
            sortOrder: existingCount + i,
            isPrimary: existingCount === 0 && i === 0, // First image becomes primary if no existing images
          },
        });

        savedImages.push(localUrl);
      } catch (downloadError) {
        console.error(`Error downloading image ${imageUrl}:`, downloadError);
      }
    }

    return NextResponse.json({
      success: true,
      saved: savedImages.length,
      images: savedImages,
    });
  } catch (error) {
    console.error('Save images error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
