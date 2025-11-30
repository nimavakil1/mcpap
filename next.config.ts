import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mcpaper.de',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**.distri-smart.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Product image sources
      {
        protocol: 'https',
        hostname: '**.staples.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'assets.lcb.essen.de',
      },
      {
        protocol: 'https',
        hostname: '**.staedtler.com',
      },
      {
        protocol: 'https',
        hostname: 'edding.com',
      },
      {
        protocol: 'https',
        hostname: 'ssl-product-images.www8-hp.com',
      },
      {
        protocol: 'https',
        hostname: '**.pelikan.com',
      },
      {
        protocol: 'https',
        hostname: 'productimages.bfrands.com',
      },
      {
        protocol: 'https',
        hostname: '**.faber-castell.com',
      },
      {
        protocol: 'https',
        hostname: '**.herma.de',
      },
      {
        protocol: 'https',
        hostname: '**.avery-zweckform.com',
      },
      {
        protocol: 'https',
        hostname: '**.sigel.de',
      },
      {
        protocol: 'https',
        hostname: '**.tesa.com',
      },
      {
        protocol: 'https',
        hostname: '**.henkel-adhesives.com',
      },
      {
        protocol: 'https',
        hostname: '**.uhu.com',
      },
      {
        protocol: 'https',
        hostname: '**.tork.de',
      },
      {
        protocol: 'https',
        hostname: 'brother.com',
      },
      {
        protocol: 'https',
        hostname: 'store.canon.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'mediaserver.goepson.com',
      },
      {
        protocol: 'https',
        hostname: '**.casio-europe.com',
      },
      {
        protocol: 'https',
        hostname: 'education.ti.com',
      },
      {
        protocol: 'https',
        hostname: '**.fellowes.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
