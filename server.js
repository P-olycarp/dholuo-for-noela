/* server.js — a tiny local server so you can preview the app. Run it with: npm run dev */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = Number(process.env.PORT) || 8000;
const ROOT = __dirname;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const file = path.normalize(path.join(ROOT, urlPath === "/" ? "index.html" : urlPath));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404);
        return res.end("Not found");
      }
      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store", // always show the latest files while you edit
      });
      res.end(data);
    });
  })
  .listen(PORT, "0.0.0.0", () => {
    console.log("\n  Dholuo is running");
    console.log(`  On this computer:  http://localhost:${PORT}`);
    Object.values(os.networkInterfaces()).flat().forEach((net) => {
      if (net.family === "IPv4" && !net.internal) console.log(`  On your phone:     http://${net.address}:${PORT}  (same Wi-Fi)`);
    });
    console.log("\n  Press Ctrl+C to stop.\n");
  });