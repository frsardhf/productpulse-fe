import { PackageOpen, Sparkles } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { productCategory } from "@/lib/catalogue";

const palettes = [
  "from-sky-100 via-indigo-50 to-violet-100 text-indigo-700",
  "from-rose-100 via-orange-50 to-amber-100 text-rose-700",
  "from-emerald-100 via-teal-50 to-cyan-100 text-emerald-700",
  "from-fuchsia-100 via-purple-50 to-sky-100 text-fuchsia-700",
] as const;

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
  const palette = palettes[Math.abs(product.id) % palettes.length];
  const category = productCategory(product);

  return (
    <div
      role="img"
      aria-label={`${product.name} placeholder artwork`}
      className={cn(
        "relative isolate flex overflow-hidden bg-gradient-to-br",
        palette,
        compact ? "min-h-44 items-end p-4" : "min-h-[360px] items-end p-7",
        className,
      )}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/50 blur-2xl" />
      <div className="absolute bottom-8 left-8 h-28 w-28 rounded-full bg-white/45 blur-xl" />
      <Sparkles className="absolute right-5 top-5 h-5 w-5 opacity-60" />
      <div className="relative z-10 flex w-full items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] opacity-70">
            ProductPulse catalogue
          </p>
          <p
            className={cn(
              "mt-2 font-semibold",
              compact ? "text-sm" : "text-lg",
            )}
          >
            {category}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/55 p-3 shadow-sm backdrop-blur">
          <PackageOpen className={compact ? "h-7 w-7" : "h-10 w-10"} />
        </div>
      </div>
    </div>
  );
}
