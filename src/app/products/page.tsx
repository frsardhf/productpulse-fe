import ProductList from "@/components/products/ProductList";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <ProductList />
      </div>
    </main>
  );
}
