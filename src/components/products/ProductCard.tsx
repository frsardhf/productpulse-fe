import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice, productCategory, stockLabel } from "@/lib/catalogue";
import ProductArtwork from "./ProductArtwork";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  readonly product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const detailsUrl = `/products/details?id=${product.id}`;
  const isLowStock = product.stock > 0 && product.stock <= 4;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-slate-200/80 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <Link href={detailsUrl} aria-label={`View ${product.name}`}>
        <ProductArtwork
          product={product}
          compact
          className="transition duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="max-w-[70%] truncate bg-white/70">
            {productCategory(product)}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {product.sourceVendor || "ProductPulse"}
          </span>
        </div>
        <CardTitle className="min-h-12 text-base leading-6">
          <Link href={detailsUrl} className="hover:text-primary">
            {product.name}
          </Link>
        </CardTitle>
        {product.variantLabel && (
          <p className="text-xs font-medium uppercase tracking-wide text-primary/80">
            Variant: {product.variantLabel}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
        <div className="flex items-end justify-between gap-3">
          <p className="text-xl font-bold tracking-tight">
            {formatPrice(product)}
          </p>
          <Badge
            variant={product.stock <= 0 ? "destructive" : "secondary"}
            className={isLowStock ? "bg-amber-100 text-amber-800" : undefined}
          >
            {stockLabel(product.stock)}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-[1fr_auto] gap-2 border-t bg-slate-50/60 pt-4">
        <AddToCartButton
          product={product}
          returnUrl={detailsUrl}
          className="w-full"
        />
        <Link
          href={detailsUrl}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open details for ${product.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
