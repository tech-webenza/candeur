
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  // basePath: "/candeur",
  // The client's printed QR code opens /assets.html; the page itself lives at /assets.
  async redirects() {
    return [{ source: "/assets.html", destination: "/assets", permanent: false }];
  },
};

export default nextConfig;
