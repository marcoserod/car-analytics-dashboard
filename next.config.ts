import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignora errores de TypeScript durante el build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint en el build
  },
};

export default nextConfig;
