/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["iyzipay"],
    turbo: {
      // Turbopack için genel ayarlar
      resolveAlias: {
        // Mevcut alias ayarları olursa buraya eklenebilir
      },
    },
  },
};

export default nextConfig;
