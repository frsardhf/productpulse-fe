"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  ImageOff,
  Info,
  PackageCheck,
  ShieldCheck,
  Store,
} from "lucide-react";
import api from "@/lib/axios";
import { Product } from "@/types/product";
import {
  formatPrice,
  normalizeProduct,
  productCategory,
  ProductApiResponse,
  stockLabel,
} from "@/lib/catalogue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductArtwork from "./ProductArtwork";
import AddToCartButton from "./AddToCartButton";

export default function ProductDetails() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("id"));
  const isValidId = Number.isSafeInteger(productId) && productId > 0;

  const {
    data: product,
    error,
    isLoading,
  } = useQuery<Product>({
    queryKey: ["catalogue-product", productId],
    queryFn: async () => {
      const response = await api.get(`/products/${productId}`);
      return normalizeProduct(response.data as ProductApiResponse);
    },
    enabled: isValidId,
    retry: 1,
  });

  if (!isValidId || error) {
    return <ProductNotFound />;
  }

  if (isLoading || !product) {
    return <ProductDetailsSkeleton />;
  }

  const detailsUrl = `/products/details?id=${product.id}`;
  return (
    <article className="mx-auto max-w-6xl">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to catalogue
      </Link>

      <div className="mt-5 grid overflow-hidden rounded-3xl border bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative bg-slate-50 p-4 sm:p-7">
          <ProductArtwork product={product} className="h-full rounded-2xl" />
          {product.imageRightsStatus !== "PERMITTED" && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
              <ImageOff className="mt-0.5 h-4 w-4 shrink-0" />
              Source photo metadata is recorded, but imagery is withheld until
              usage permission is confirmed.
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{productCategory(product)}</Badge>
            {product.variantLabel && (
              <Badge variant="secondary">{product.variantLabel}</Badge>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {product.sourceVendor || "Relicase catalogue"}
          </p>

          <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-y py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Demo price
              </p>
              <p className="mt-1 text-3xl font-bold">{formatPrice(product)}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  product.stock > 0 ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {stockLabel(product.stock)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Relicase simulated inventory
              </p>
            </div>
          </div>

          <section className="mt-7" aria-labelledby="description-heading">
            <h2 id="description-heading" className="font-semibold">
              About this item
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {product.description}
            </p>
          </section>

          <dl className="mt-7 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Local product ID</dt>
              <dd className="mt-1 font-medium">#{product.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Met object ID</dt>
              <dd className="mt-1 font-medium">
                {product.sourceVariantId || "Not provided"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Image license</dt>
              <dd className="mt-1 font-medium">
                {product.sourceLicense || "Not recorded"}
              </dd>
            </div>
            {product.sourceAttribution && (
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Attribution</dt>
                <dd className="mt-1 font-medium">
                  {product.sourceAttribution}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
            <AddToCartButton
              product={product}
              returnUrl={detailsUrl}
              size="lg"
              className="w-full"
            />
            {product.sourceUrl && (
              <Button asChild variant="outline" size="lg">
                <a href={product.sourceUrl} target="_blank" rel="noreferrer">
                  View at The Met <ExternalLink />
                </a>
              </Button>
            )}
          </div>

          <div className="mt-6 flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs leading-5 text-indigo-950">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Portfolio demo: Relicase sells no real prints and is not affiliated
            with The Met. Prices, inventory, orders, and checkout are simulated.
          </div>

          <div className="mt-auto grid grid-cols-3 gap-3 pt-8 text-center text-[0.7rem] text-muted-foreground">
            <div className="rounded-xl border p-3">
              <Store className="mx-auto mb-2 h-4 w-4" /> CC0 artwork
            </div>
            <div className="rounded-xl border p-3">
              <PackageCheck className="mx-auto mb-2 h-4 w-4" /> Local stock
            </div>
            <div className="rounded-xl border p-3">
              <ShieldCheck className="mx-auto mb-2 h-4 w-4" /> Simulated
              checkout
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border bg-white px-6 py-20 text-center shadow-sm">
      <PackageCheck className="mx-auto h-10 w-10 text-muted-foreground" />
      <h1 className="mt-5 text-2xl font-bold">Product not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This catalogue item may have moved or the link is incomplete.
      </p>
      <Button asChild className="mt-6">
        <Link href="/products">Browse the catalogue</Link>
      </Button>
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 rounded-3xl border bg-white p-6 lg:grid-cols-2">
      <Skeleton className="min-h-[420px] w-full rounded-2xl" />
      <div className="space-y-5 py-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}
