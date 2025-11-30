/**
 * Script to fetch real product images by searching EAN codes
 * Run with: npx tsx scripts/fetch-product-images.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Delay function to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Search for product images using EAN
async function searchProductImages(ean: string, productName: string): Promise<string[]> {
  const images: string[] = [];

  try {
    // Search using EAN on UPCitemdb (they have product images)
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
          images.push(...item.images.slice(0, 2));
        }
      }
    }
  } catch (error) {
    console.log(`  UPCitemdb lookup failed for ${ean}`);
  }

  // If we don't have 2 images yet, try Open Food Facts (works for some products)
  if (images.length < 2 && ean) {
    try {
      const offResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${ean}.json`);
      if (offResponse.ok) {
        const data = await offResponse.json();
        if (data.product && data.product.image_url) {
          images.push(data.product.image_url);
        }
        if (data.product && data.product.image_front_url && images.length < 2) {
          images.push(data.product.image_front_url);
        }
      }
    } catch (error) {
      // Silently fail
    }
  }

  return images.slice(0, 2);
}

// Generate search-based image URL using DuckDuckGo or similar
function generateSearchImageUrl(productName: string, manufacturer: string | null): string {
  // Use a reliable image service with product-related images
  const searchTerm = encodeURIComponent(`${manufacturer || ''} ${productName}`.trim());

  // These are placeholder URLs that will be replaced with actual search results
  // For now, use high-quality stock images from Unsplash based on product category
  return `https://source.unsplash.com/400x400/?office,supplies,${searchTerm}`;
}

async function main() {
  console.log('🖼️  Fetching real product images by EAN...\n');

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
  let failCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] Processing: ${product.name}`);

    let imageUrls: string[] = [];

    // Try to find images by EAN
    if (product.ean) {
      console.log(`   Searching EAN: ${product.ean}`);
      imageUrls = await searchProductImages(product.ean, product.name);
      await delay(500); // Rate limiting
    }

    // If no images found, generate fallback URLs
    if (imageUrls.length === 0) {
      console.log(`   No images found via EAN, using category fallback`);

      // Use category-specific Unsplash images
      const categoryKeywords: Record<string, string> = {
        'papier-drucken': 'paper,office',
        'schreibwaren': 'pen,pencil,stationery',
        'ordnen-archivieren': 'folder,binder,filing',
        'tinte-toner': 'printer,ink,cartridge',
        'buerotechnik': 'calculator,office,technology',
        'versand-verpackung': 'package,shipping,box',
        'hygiene-reinigung': 'cleaning,hygiene,tissue',
        'praesentation': 'presentation,whiteboard,flipchart',
        'schule-kreativ': 'school,craft,creative',
        'bueromoebel-accessoires': 'desk,office,furniture',
      };

      const keywords = categoryKeywords[product.category?.slug || ''] || 'office,supplies';

      // Generate 2 different Unsplash image URLs
      imageUrls = [
        `https://source.unsplash.com/400x400/?${keywords}&sig=${product.id.slice(0, 8)}`,
        `https://source.unsplash.com/400x400/?${keywords}&sig=${product.id.slice(8, 16)}`,
      ];
    }

    // Ensure we have exactly 2 images (pad with fallback if needed)
    while (imageUrls.length < 2) {
      imageUrls.push(`https://source.unsplash.com/400x400/?office,product&sig=${Date.now()}`);
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
      failCount++;
    }

    // Small delay between products
    await delay(100);
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount} products`);
  console.log(`   ❌ Failed: ${failCount} products`);
  console.log(`   📷 Total images created: ${successCount * 2}`);

  await prisma.$disconnect();
}

main().catch(console.error);
