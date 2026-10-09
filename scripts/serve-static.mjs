import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const outputDirectory = resolve("out");
const port = Number(process.env.PORT ?? 4173);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function existingFile(pathname) {
  const relativePath = normalize(decodeURIComponent(pathname)).replace(
    /^[/\\]+/,
    "",
  );
  const candidates = pathname.endsWith("/")
    ? [join(relativePath, "index.html")]
    : [relativePath, `${relativePath}.html`, join(relativePath, "index.html")];

  for (const candidate of candidates) {
    const absolutePath = resolve(outputDirectory, candidate);
    if (
      absolutePath !== outputDirectory &&
      !absolutePath.startsWith(`${outputDirectory}${sep}`)
    ) {
      continue;
    }

    try {
      if ((await stat(absolutePath)).isFile()) return absolutePath;
    } catch {
      // Try the next static route shape.
    }
  }

  return join(outputDirectory, "404.html");
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  const filePath = await existingFile(url.pathname);
  const isNotFound = filePath.endsWith(`${sep}404.html`);

  response.writeHead(isNotFound ? 404 : 200, {
    "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static export available at http://127.0.0.1:${port}`);
});
