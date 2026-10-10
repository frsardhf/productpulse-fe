import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturedArtworkCarousel from "@/components/home/FeaturedArtworkCarousel";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white pt-16">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-purple-700">Relicase</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            East Asian art prints
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
            Browse 24 public-domain works from The Met Open Access collection.
            Search the catalogue, manage a cart, and try the simulated checkout
            flow.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="shadow-none">
              <Link href="/products">
                Browse products <ArrowRight />
              </Link>
            </Button>
            <Link
              href="/signup"
              className="text-sm font-medium text-slate-700 underline-offset-4 hover:text-purple-700 hover:underline"
            >
              Create an account
            </Link>
          </div>

          <p className="mt-10 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-500">
            Prices, stock, and orders are simulated. Artwork images are provided
            by The Metropolitan Museum of Art under CC0.
          </p>
        </div>
        <FeaturedArtworkCarousel />
      </section>
    </main>
  );
}
