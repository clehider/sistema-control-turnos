/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Removemos la sección experimental y rewrites
}

module.exports = nextConfig
