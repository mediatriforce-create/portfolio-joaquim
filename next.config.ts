import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // output: "export", // ativar apenas para build de produção (Cloudflare Pages)
};

export default nextConfig;
