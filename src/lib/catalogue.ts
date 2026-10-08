import { Product } from "@/types/product";

export type ProductApiResponse = Omit<Product, "price"> & {
  price: number | string;
};

export type AvailabilityFilter =
  "all" | "in-stock" | "low-stock" | "out-of-stock";

export type ProductSort = "featured" | "price-asc" | "price-desc" | "name-asc";

export const CATALOGUE_PAGE_SIZE = 8;

export function normalizeProduct(product: ProductApiResponse): Product {
  const price = Number(product.price);
  return {
    ...product,
    price: Number.isFinite(price) ? price : 0,
  };
}

export function productPrice(product: Product): number {
  const price = Number(product.price);
  return Number.isFinite(price) ? price : 0;
}

export function formatPrice(product: Product): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(productPrice(product));
}

export function productCategory(product: Product): string {
  return product.sourceCategory?.trim() || `Category ${product.categoryId}`;
}

export function stockLabel(stock: number): string {
  if (stock <= 0) return "Out of stock";
  if (stock <= 4) return `Only ${stock} left`;
  return `${stock} in stock`;
}

export function matchesAvailability(
  product: Product,
  filter: AvailabilityFilter,
): boolean {
  if (filter === "in-stock") return product.stock > 4;
  if (filter === "low-stock") return product.stock > 0 && product.stock <= 4;
  if (filter === "out-of-stock") return product.stock <= 0;
  return true;
}

export function matchesSearch(product: Product, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;

  return [
    product.name,
    product.description,
    product.sourceVendor,
    product.sourceCategory,
    product.variantLabel,
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(normalizedSearch));
}

export function sortProducts(
  products: Product[],
  sort: ProductSort,
): Product[] {
  const sorted = [...products];
  if (sort === "price-asc") {
    return sorted.sort(
      (left, right) => productPrice(left) - productPrice(right),
    );
  }
  if (sort === "price-desc") {
    return sorted.sort(
      (left, right) => productPrice(right) - productPrice(left),
    );
  }
  if (sort === "name-asc") {
    return sorted.sort((left, right) => left.name.localeCompare(right.name));
  }
  return sorted.sort((left, right) => left.id - right.id);
}
