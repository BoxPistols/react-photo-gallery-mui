/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', '@mui/lab'],
  },
  transpilePackages: ['@mui/material', '@mui/icons-material', '@mui/lab'],
}

export default nextConfig