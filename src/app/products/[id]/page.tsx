import { Suspense } from 'react';
import api from '@/lib/axios';
import { Product } from '@/types/product';
import ProductCard from '@/components/products/ProductCard';

async function getProduct(id: string): Promise<Product> {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Product does not exist.")
  }
}

function formatPrice(price: number) {
  return (Math.round(price * 100) / 100).toFixed(2);
}

function LoadingUI() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

const categories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Books' },
  { id: 3, name: 'Clothing' },
];

function ProductDetail({ product }: { readonly product: Product }) {
  const category = categories.find(cat => cat.id === product.categoryId);
  const categoryName = category ? category.name : 'Unknown Category';

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 pt-[72px]">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-semibold text-primary">
                  ${formatPrice(product.price)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="mt-3">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-gray-600 text-sm">
                {product.description}
              </p>
            </div>

            <div className="mt-4">
              <ProductCard product={product} />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Product Details
          </h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {categoryName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Product ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage(
  { params }: Readonly<{ params: { id: string } }>) {
  
  let product: Product | null = null;
  let errorMessage: string | null = null;

  try {
    product = await getProduct(params.id);
  } catch (error) {
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred.";
    }
  }

  return (
    <Suspense fallback={<LoadingUI />}>
      {errorMessage ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <p>{errorMessage}</p>
          </div>
        </div>
      ) : (
        product && <ProductDetail product={product} />
      )}
    </Suspense>
  );
}