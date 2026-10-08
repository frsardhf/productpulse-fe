"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import api from "@/lib/axios";
import { Product } from "@/types/product";
import {
  AvailabilityFilter,
  CATALOGUE_PAGE_SIZE,
  matchesAvailability,
  matchesSearch,
  normalizeProduct,
  productCategory,
  ProductApiResponse,
  ProductSort,
  sortProducts,
} from "@/lib/catalogue";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_CATEGORIES = "all";

export default function ProductList() {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [sort, setSort] = useState<ProductSort>("featured");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchInput);

  const { data, error, isLoading, isFetching, refetch } = useQuery<Product[]>({
    queryKey: ["catalogue-products"],
    queryFn: async () => {
      const response = await api.get("/products/all");
      if (!Array.isArray(response.data)) {
        throw new Error("Catalogue response was not a product list");
      }
      return (response.data as ProductApiResponse[]).map(normalizeProduct);
    },
    refetchOnWindowFocus: false,
  });

  const products = useMemo(() => data ?? [], [data]);
  const categories = useMemo(
    () =>
      Array.from(new Set(products.map(productCategory))).sort((left, right) =>
        left.localeCompare(right),
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        matchesSearch(product, deferredSearch) &&
        (category === ALL_CATEGORIES ||
          productCategory(product) === category) &&
        matchesAvailability(product, availability),
    );
    return sortProducts(filtered, sort);
  }, [availability, category, deferredSearch, products, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / CATALOGUE_PAGE_SIZE),
  );
  const visibleProducts = filteredProducts.slice(
    (page - 1) * CATALOGUE_PAGE_SIZE,
    page * CATALOGUE_PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [availability, category, deferredSearch, sort]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const hasFilters =
    Boolean(searchInput) ||
    category !== ALL_CATEGORIES ||
    availability !== "all" ||
    sort !== "featured";

  const clearFilters = () => {
    setSearchInput("");
    setCategory(ALL_CATEGORIES);
    setAvailability("all");
    setSort("featured");
  };

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center">
        <AlertCircle className="mx-auto h-9 w-9 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-red-950">
          The catalogue could not be loaded
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-red-800/80">
          The storefront API may be unavailable. Your browser does not contact
          the merchandise source directly.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => refetch()}>
          <RotateCcw /> Try again
        </Button>
      </div>
    );
  }

  return (
    <section aria-label="Product catalogue">
      <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Find your item
          {isFetching && !isLoading && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin text-primary" />
          )}
        </div>
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1.5fr)_repeat(3,minmax(150px,1fr))_auto]">
          <label className="relative block">
            <span className="sr-only">Search merchandise</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search names, variants, or makers"
              className="pl-9"
            />
          </label>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
              {categories.map((categoryName) => (
                <SelectItem key={categoryName} value={categoryName}>
                  {categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={availability}
            onValueChange={(value) =>
              setAvailability(value as AvailabilityFilter)
            }
          >
            <SelectTrigger aria-label="Filter by local availability">
              <SelectValue placeholder="All inventory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All inventory</SelectItem>
              <SelectItem value="in-stock">In stock</SelectItem>
              <SelectItem value="low-stock">Low stock</SelectItem>
              <SelectItem value="out-of-stock">Out of stock</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as ProductSort)}
          >
            <SelectTrigger aria-label="Sort merchandise">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="justify-self-stretch lg:justify-self-auto"
          >
            <RotateCcw /> Reset
          </Button>
        </div>
        <p className="mt-4 border-t pt-4 text-xs leading-5 text-muted-foreground">
          Catalogue metadata is sourced from Good Smile US. ProductPulse stock
          and orders are portfolio simulations.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite">
          {isLoading
            ? "Loading catalogue..."
            : `${filteredProducts.length} ${filteredProducts.length === 1 ? "item" : "items"} found`}
        </p>
        {!isLoading && filteredProducts.length > 0 && (
          <p>
            Showing {(page - 1) * CATALOGUE_PAGE_SIZE + 1}–
            {Math.min(page * CATALOGUE_PAGE_SIZE, filteredProducts.length)}
          </p>
        )}
      </div>

      {isLoading ? (
        <CatalogueSkeleton />
      ) : visibleProducts.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed bg-white px-6 py-20 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">
            No matching merchandise
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader search or reset the catalogue filters.
          </p>
          <Button className="mt-6" variant="outline" onClick={clearFilters}>
            Reset filters
          </Button>
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-2"
          aria-label="Catalogue pagination"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === page ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            ),
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
        </nav>
      )}
    </section>
  );
}

function CatalogueSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: CATALOGUE_PAGE_SIZE }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border bg-white p-4"
        >
          <Skeleton className="h-44 w-full" />
          <Skeleton className="mt-5 h-4 w-24" />
          <Skeleton className="mt-3 h-6 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-6 h-9 w-full" />
        </div>
      ))}
    </div>
  );
}
