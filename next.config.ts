import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Pin Turbopack's workspace root so stray lockfiles above don't confuse it.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
