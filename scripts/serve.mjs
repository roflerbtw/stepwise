import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep, extname } from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
};
const port = Number(process.env.PORT) || 4173;
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const file = resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (
      !file.startsWith(root.endsWith(sep) ? root : root + sep) ||
      !types[extname(file)]
    ) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[extname(file)],
      "Cache-Control": "no-store",
    });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  process.stdout.write(`Stepwise: http://127.0.0.1:${port}\n`),
);
