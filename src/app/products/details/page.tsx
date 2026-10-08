import { Suspense } from "react";
import ProductDetails from "@/components/products/ProductDetails";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
      <Suspense
        fallback={
          <Skeleton className="mx-auto h-[620px] max-w-6xl rounded-3xl" />
        }
      >
        <ProductDetails />
      </Suspense>
    </main>
  );
}
