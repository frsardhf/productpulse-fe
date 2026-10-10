"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import api from "@/lib/axios";
import { normalizeProduct, ProductApiResponse } from "@/lib/catalogue";
import { Product } from "@/types/product";

const FEATURED_IDS = ["55919", "53653", "54626", "36075"];

export default function FeaturedArtworkCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { data = [] } = useQuery<Product[]>({
    queryKey: ["catalogue-products"],
    queryFn: async () => {
      const response = await api.get("/products/all");
      return (response.data as ProductApiResponse[]).map(normalizeProduct);
    },
    refetchOnWindowFocus: false,
  });

  const artwork = useMemo(() => {
    const available = data.filter(
      (product) =>
        product.imageRightsStatus === "PERMITTED" && product.imageUrl,
    );
    const featured = FEATURED_IDS.map((id) =>
      available.find((product) => product.sourceVariantId === id),
    ).filter((product): product is Product => Boolean(product));
    return featured.length === FEATURED_IDS.length
      ? featured
      : available.slice(0, 4);
  }, [data]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (paused || interacting || reducedMotion || artwork.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % artwork.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [artwork.length, interacting, paused, reducedMotion]);

  useEffect(() => {
    if (index >= artwork.length) setIndex(0);
  }, [artwork.length, index]);

  if (artwork.length === 0) {
    return <div className="aspect-[4/5] rounded-2xl bg-stone-100" />;
  }

  const current = artwork[index];
  const move = (direction: number) =>
    setIndex((value) => (value + direction + artwork.length) % artwork.length);

  return (
    <figure
      className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      <div className="relative aspect-[4/5]">
        {artwork.map((product, productIndex) => (
          <Image
            key={product.id}
            src={product.imageUrl as string}
            alt={product.imageAlt || product.name}
            fill
            priority={productIndex === 0}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={`object-contain p-5 transition-opacity duration-700 ${
              productIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <figcaption className="border-t border-stone-200 bg-white px-4 py-3 pr-36">
        <p className="truncate text-sm font-medium text-stone-900">
          {current.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-stone-500">
          {current.sourceVendor}
        </p>
      </figcaption>

      <div className="absolute bottom-3 right-3 flex gap-1">
        <button type="button" onClick={() => move(-1)} className="rounded-md border bg-white p-2 text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600" aria-label="Previous artwork">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setPaused((value) => !value)} className="rounded-md border bg-white p-2 text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600" aria-label={paused ? "Play slideshow" : "Pause slideshow"}>
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        <button type="button" onClick={() => move(1)} className="rounded-md border bg-white p-2 text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600" aria-label="Next artwork">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </figure>
  );
}
