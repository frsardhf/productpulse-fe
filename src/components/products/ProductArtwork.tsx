import Image from "next/image";
import { PackageOpen } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { productCategory } from "@/lib/catalogue";

interface ProductArtworkProps {
  readonly product: Product;
  readonly className?: string;
  readonly compact?: boolean;
}

export default function ProductArtwork({
  product,
  className,
  compact = false,
}: ProductArtworkProps) {
  if (product.imageRightsStatus === "PERMITTED" && product.imageUrl) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-stone-100",
          compact ? "aspect-[4/3]" : "min-h-[420px]",
          className,
        )}
      >
        <Image
          src={product.imageUrl}
          alt={product.imageAlt || product.name}
          fill
          sizes={compact ? "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 45vw, 100vw"}
          className="object-contain p-3 sm:p-5"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${product.name} placeholder artwork`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-stone-100 text-stone-500",
        compact ? "aspect-[4/3]" : "min-h-[420px]",
        className,
      )}
    >
      <div className="text-center">
        <PackageOpen className="mx-auto h-9 w-9" />
        <p className="mt-3 text-sm font-medium">{productCategory(product)}</p>
      </div>
    </div>
  );
}
