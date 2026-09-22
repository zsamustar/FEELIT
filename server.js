// Small dependency-free static server used by abrir-feel-it.bat.
// It deliberately serves only files inside this project folder.
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 4174;
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  const requestedPath = decodeURIComponent(request.url.split("?")[0]);
  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.replace(/^[/\\]+/, "");
  const filePath = path.resolve(root, relativePath);
  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== root) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    fs.createReadStream(filePath).pipe(response);
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`Feel It ya está disponible en http://127.0.0.1:${port}`);
    process.exit(0);
  }
  console.error(error.message);
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Feel It listo en http://127.0.0.1:${port}`);
});
