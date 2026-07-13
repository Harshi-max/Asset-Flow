import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Turbopack resolves the project root correctly
  // This points to the directory containing the next package (project root)
  // Prevents the "Next.js package not found" error during dev/build.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
