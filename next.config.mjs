import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  webpack: (config) => {
    // Neutralizza gli import WebGPU/TSL di three-globe (percorso non usato) per
    // non far crashare i browser senza WebGPU, es. Safari iOS. Vedi gli stub.
    config.resolve.alias = {
      ...config.resolve.alias,
      "three/webgpu$": path.resolve(__dirname, "stubs/three-webgpu-stub.mjs"),
      "three/tsl$": path.resolve(__dirname, "stubs/three-tsl-stub.mjs"),
    };
    return config;
  },
};

export default nextConfig;
