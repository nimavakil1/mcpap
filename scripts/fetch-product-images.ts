/**
 * Script to fetch real product images by searching EAN codes
 * Run with: npx tsx scripts/fetch-product-images.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Delay function to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a unique but consistent seed from product ID for reproducible images
function generateSeed(productId: string, index: number): number {
  let hash = 0;
  const str = productId + index.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 1000;
}

// Search for product images using EAN via UPCitemdb
async function searchProductImages(ean: string): Promise<string[]> {
  const images: string[] = [];

  try {
    const upcResponse = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${ean}`, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (upcResponse.ok) {
      const data = await upcResponse.json();
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        if (item.images && item.images.length > 0) {
          // Filter for https URLs only
          const httpsImages = item.images.filter((url: string) => url.startsWith('https://'));
          images.push(...httpsImages.slice(0, 2));
        }
      }
    }
  } catch (error) {
    // Silently fail
  }

  return images;
}

async function main() {
  console.log('🖼️  Fetching product images...\n');

  // Step 1: Delete all existing images
  console.log('🗑️  Removing all existing product images...');
  const deleteResult = await prisma.productImage.deleteMany({});
  console.log(`   Deleted ${deleteResult.count} images\n`);

  // Step 2: Get all products
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  console.log(`📦 Found ${products.length} products to process\n`);

  let successCount = 0;
  let eanFoundCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] Processing: ${product.name}`);

    let imageUrls: string[] = [];

    // Try to find images by EAN
    if (product.ean) {
      console.log(`   Searching EAN: ${product.ean}`);
      imageUrls = await searchProductImages(product.ean);

      if (imageUrls.length > 0) {
        console.log(`   Found ${imageUrls.length} images via EAN`);
        eanFoundCount++;
      }

      await delay(300); // Rate limiting for API
    }

    // Generate Lorem Picsum URLs as fallback (these always work!)
    // Using unique seeds based on product ID for consistent but varied images
    const seed1 = generateSeed(product.id, 1);
    const seed2 = generateSeed(product.id, 2);

    // Pad with Lorem Picsum images if we don't have 2
    while (imageUrls.length < 2) {
      const seed = imageUrls.length === 0 ? seed1 : seed2;
      // Lorem Picsum with seed for consistent images per product
      imageUrls.push(`https://picsum.photos/seed/${seed}/400/400`);
    }

    // Create image records
    try {
      await prisma.productImage.createMany({
        data: [
          {
            productId: product.id,
            url: imageUrls[0],
            altText: product.name,
            isPrimary: true,
            sortOrder: 0,
          },
          {
            productId: product.id,
            url: imageUrls[1],
            altText: `${product.name} - Bild 2`,
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      });

      console.log(`   ✅ Added 2 images`);
      successCount++;
    } catch (error) {
      console.log(`   ❌ Failed to add images`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount} products`);
  console.log(`   🔍 Found via EAN: ${eanFoundCount} products`);
  console.log(`   📷 Total images created: ${successCount * 2}`);

  await prisma.$disconnect();
}

main().catch(console.error);
