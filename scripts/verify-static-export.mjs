import { access, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const outputDirectory = resolve("out");
const expectedRoutes = [
  "index.html",
  "404.html",
  "products/index.html",
  "products/details/index.html",
  "cart/index.html",
  "checkout/index.html",
  "login/index.html",
  "order/index.html",
];

await Promise.all(
  expectedRoutes.map((route) => access(join(outputDirectory, route))),
);

const nextAssets = await readdir(join(outputDirectory, "_next"));
if (nextAssets.length === 0) {
  throw new Error("Static export contains no Next.js assets");
}

console.log(
  `Verified static export: ${expectedRoutes.length} routes and ${nextAssets.length} _next asset groups.`,
);
