import { type ViteDevServer, createServer } from "vite";
import type { Express } from "express";
import type { Server } from "http";
import express from "express";

export async function setupVite(app: Express, server: Server): Promise<ViteDevServer> {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: "client",
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  return vite;
}

export function serveStatic(app: Express) {
  const path = await import("path");
  const { fileURLToPath } = await import("url");

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(__dirname, "../client/dist");

  app.use(express.static(distPath));

  // Handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}