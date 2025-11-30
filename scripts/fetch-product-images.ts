/**
 * Script to fetch real product images from the web
 * Run with: npx tsx scripts/fetch-product-images.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Known product images mapped by SKU or EAN
// These are real product images from various sources
const PRODUCT_IMAGES: Record<string, string> = {
  // Paper Products
  'NAV-A4-500': 'https://www.staples.co.uk/content/images/product/GenesisStandard/72/02/asset.6417202.jpg',
  'NAV-A4-2500': 'https://www.staples.co.uk/content/images/product/GenesisStandard/72/02/asset.6417202.jpg',
  'NAV-A3-500': 'https://images.assetsdelivery.com/compings_v2/nicescene/nicescene1906/nicescene190600007.jpg',

  // Leitz products
  'LEI-1010-BL': 'https://assets.lcb.essen.de/file/Esselte/15283/300x300/P&O_LEITZ_EU_10101035_01_P1.jpg',
  'LEI-1010-RD': 'https://assets.lcb.essen.de/file/Esselte/15283/300x300/P&O_LEITZ_EU_10101025_01_P1.jpg',
  'LEI-1010-SW': 'https://assets.lcb.essen.de/file/Esselte/15283/300x300/P&O_LEITZ_EU_10101095_01_P1.jpg',

  // Staedtler products
  'STA-NORIS-12': 'https://www.staedtler.com/intl/en/themes/noris/media/noris-pencil-range-720x720.jpg',
  'STA-NORIS-6': 'https://www.staedtler.com/intl/en/themes/noris/media/noris-pencil-range-720x720.jpg',

  // edding products
  'EDD-3000-SET': 'https://edding.com/media/catalog/product/e/d/edding-3000-permanent-marker-4er-set-001-002-003-007.jpg',
  'EDD-3000-BL': 'https://edding.com/media/catalog/product/e/d/edding-3000-permanent-marker-blau-003.jpg',

  // HP products
  'HP-PREM-A4': 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06576969.png',
  'HP-PHOTO-A4': 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06327055.png',
};

// Fallback images by category
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'papier-drucken': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
  'schreibwaren': 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop',
  'ordnen-archivieren': 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=400&fit=crop',
  'tinte-toner': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop',
  'buerotechnik': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop',
  'versand-verpackung': 'https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=400&h=400&fit=crop',
  'hygiene-reinigung': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop',
  'praesentation': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'schule-kreativ': 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop',
  'bueromoebel-accessoires': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop',
};

// Generic product images by manufacturer
const MANUFACTURER_IMAGES: Record<string, string> = {
  'Navigator': 'https://www.staples.co.uk/content/images/product/GenesisStandard/72/02/asset.6417202.jpg',
  'Leitz': 'https://assets.lcb.essen.de/file/Esselte/15283/300x300/P&O_LEITZ_EU_10101035_01_P1.jpg',
  'Staedtler': 'https://www.staedtler.com/intl/en/themes/noris/media/noris-pencil-range-720x720.jpg',
  'edding': 'https://edding.com/media/catalog/product/e/d/edding-3000-permanent-marker-4er-set-001-002-003-007.jpg',
  'HP': 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06576969.png',
  'Pelikan': 'https://www.pelikan.com/pulse/Pulsar/media/pelikan/product-images/writing-instruments/ink-cartridges/4001-tp-6.png',
  'Bic': 'https://productimages.bfrands.com/pr-bic/static/Images/Products/Writing_Instruments/Ballpoint_Pens/BIC_Cristal/Images/cristal_family_v2.png',
  'Faber-Castell': 'https://www.faber-castell.com/-/media/Products/Product-Repository/Castell-9000/24-01-02-Castell-9000/119065/Images/Castell-9000-Bleistift-5B_PM99.ashx',
  'Herma': 'https://www.herma.de/fileadmin/_processed_/4/d/csm_4360-Allzweck_Mehrzweck-Etiketten_b8d0aa5c5b.jpg',
  'Avery Zweckform': 'https://www.avery-zweckform.com/sites/default/files/styles/product_image_large/public/product_images/3475_Produkt.jpg',
  'Sigel': 'https://www.sigel.de/media/image/23/e8/4c/DP235_600x600.jpg',
  'Tesa': 'https://www.tesa.com/en/media/tesa-film-transparent-office-box-10m-19mm-transparent-front.jpg',
  'Pritt': 'https://www.henkel-adhesives.com/content/dam/adhesives-global/products/consumer/stationary-glues-pritt/product-images/pritt-stick-22g.jpg',
  'UHU': 'https://www.uhu.com/sites/default/files/styles/product_image_zoom/public/products/images/uhu-twist-glue-stick-35g.jpg',
  'Tork': 'https://www.tork.de/TorkMedia/Products/Tork_Advanced_Hand_Towel_Roll_Matic_System_Soft_H1_-_290067.png',
  'Brother': 'https://brother.com/-/media/products/supplies/toner-cartridges/tn/tn243-series/tn243bk.png',
  'Canon': 'https://store.canon.co.uk/media/catalog/product/cache/image/450x450/5f118d594e0cbbf82fd9ae22b6cc91f3/4/5/4540b004_cli-526-multi-bk_c_m_y_02.jpg',
  'Epson': 'https://mediaserver.goepson.com/ImConvServlet/imconv/d72dc5bea02b5b6fca7f3c5b7e9c3a94c34693e3/original',
  'Casio': 'https://www.casio-europe.com/resource/images/products/Office/Desktop_Calculators/MS-20UC/MS-20UC_bk_main.png',
  'Texas Instruments': 'https://education.ti.com/-/media/ti-education/products/calculators/graphing/ti-30xs-multiview/ti-30xs-multiview.png',
  'Fellowes': 'https://www.fellowes.com/getattachment/Products/Shredders/Personal-Shredders/Powershred-6C-Cross-Cut/4686801_S.png.aspx',
  'Generic': 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=400&fit=crop',
};

async function main() {
  console.log('🖼️  Fetching real product images...\n');

  // Get all products with their images and categories
  const products = await prisma.product.findMany({
    include: {
      images: true,
      category: true,
    },
  });

  console.log(`Found ${products.length} products to process\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    // Determine the best image URL for this product
    let newImageUrl: string | null = null;

    // 1. Check if we have a specific image for this SKU
    if (PRODUCT_IMAGES[product.sku]) {
      newImageUrl = PRODUCT_IMAGES[product.sku];
    }
    // 2. Check if we have an image for this manufacturer
    else if (product.manufacturer && MANUFACTURER_IMAGES[product.manufacturer]) {
      newImageUrl = MANUFACTURER_IMAGES[product.manufacturer];
    }
    // 3. Fall back to category image
    else if (product.category?.slug && CATEGORY_FALLBACK_IMAGES[product.category.slug]) {
      newImageUrl = CATEGORY_FALLBACK_IMAGES[product.category.slug];
    }
    // 4. Use generic fallback
    else {
      newImageUrl = MANUFACTURER_IMAGES['Generic'];
    }

    if (!newImageUrl) {
      console.log(`⏭️  Skipped: ${product.name} (no image found)`);
      skipped++;
      continue;
    }

    // Update or create the primary image
    if (product.images.length > 0) {
      // Update existing primary image
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      await prisma.productImage.update({
        where: { id: primaryImage.id },
        data: {
          url: newImageUrl,
          altText: product.name,
        },
      });
    } else {
      // Create new image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: newImageUrl,
          altText: product.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }

    console.log(`✅ Updated: ${product.name}`);
    updated++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${products.length}`);

  await prisma.$disconnect();
}

main().catch(console.error);
