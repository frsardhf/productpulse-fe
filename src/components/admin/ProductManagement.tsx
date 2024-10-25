'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { AdminProtection } from '@/components/auth/AdminProtection';
import { Product } from '@/types/product';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 1,
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/all');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' || name === 'stock' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, formData);
        setSuccess('Product updated successfully');
      } else {
        await api.post('/products', formData);
        setSuccess('Product created successfully');
      }
      fetchProducts();
      setFormData({ id: 0, name: '', description: '', price: 0, stock: 0, categoryId: 1 });
      setEditingProductId(null);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(Array.isArray(axiosError.response?.data?.message) 
        ? axiosError.response?.data?.message.join(', ') 
        : axiosError.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingProductId(product.id || null);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(Array.isArray(axiosError.response?.data?.message) 
        ? axiosError.response?.data?.message.join(', ') 
        : axiosError.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Product Management</h2>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-500 p-4 rounded-md mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product Name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Price"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Stock"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category ID
            </label>
            <input
              name="categoryId"
              type="number"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Category ID"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Description"
            rows={3}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {editingProductId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id!)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProtection(ProductManagement);
