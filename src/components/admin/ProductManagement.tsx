'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { AdminProtection } from '@/components/auth/AdminProtection';
import { Product, UpdatedProduct } from '@/types/product';
import { ErrorResponse } from '@/types/admin';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductManagement: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<UpdatedProduct>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 1,
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [formErrors, setFormErrors] = useState<{
    [key: string]: string;
  }>({});

  function formatPrice(price: number) {
    return (Math.round(price * 100) / 100).toFixed(2);
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (formData.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }
    if (formData.categoryId < 1) {
      errors.categoryId = 'Invalid category ID';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/products/all');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.log(err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
    }
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === 'price' || name === 'stock' || name === 'categoryId') {
      parsedValue = value === '' ? 0 : Number(value);
      
      if (name === 'price') {
        parsedValue = Math.max(0, parsedValue);
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: Number(formData.categoryId)
      };

      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, submissionData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await api.post('/products', submissionData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      fetchProducts();
      setFormData({ name: '', description: '', price: 0, stock: 0, categoryId: 1 });
      setEditingProductId(null);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      toast({
        variant: "destructive",
        title: "Error",
        description: Array.isArray(axiosError.response?.data?.message) 
          ? axiosError.response?.data?.message.join(', ') 
          : axiosError.response?.data?.message ?? 'An error occurred',
      });
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingProductId(product.id || null);
    setFormErrors({});
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    
    try {
      await api.delete(`/products/${deleteProductId}`);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      toast({
        variant: "destructive",
        title: "Error",
        description: Array.isArray(axiosError.response?.data?.message) 
          ? axiosError.response?.data?.message.join(', ') 
          : axiosError.response?.data?.message ?? 'An error occurred',
      });
    }
    setDeleteProductId(null);
  };

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
    
    const sorted = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredProducts(sorted);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
    
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Product Management</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="product-name" className="text-sm font-medium">
                Product Name
              </label>
              <Input
                id="product-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                required
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product-price" className="text-sm font-medium">
                Price
              </label>
              <Input
                id="product-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
              />
              {formErrors.price && (
                <p className="text-sm text-destructive">{formErrors.price}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product-stock" className="text-sm font-medium">
                Stock
              </label>
              <Input
                id="product-stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Stock"
                required
              />
              {formErrors.stock && (
                <p className="text-sm text-destructive">{formErrors.stock}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product-categoryId" className="text-sm font-medium">
                Category ID
              </label>
              <Input
                id="product-categoryId"
                name="categoryId"
                type="number"
                min="1"
                value={formData.categoryId}
                onChange={handleInputChange}
                placeholder="Category ID"
                required
              />
              {formErrors.categoryId && (
                <p className="text-sm text-destructive">{formErrors.categoryId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="product-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="product-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows={3}
              required
            />
            {formErrors.description && (
              <p className="text-sm text-destructive">{formErrors.description}</p>
            )}
          </div>

          <Button type="submit" className="w-full md:w-auto">
            {editingProductId ? 'Update Product' : 'Add Product'}
          </Button>
        </form>

        <Separator className="my-8" />

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>
          
          <Select
            value={sortConfig?.key}
            onValueChange={(value) => handleSort(value as keyof Product)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
          <table className="w-full">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b">
                <th className="text-left p-4 font-medium">
                  <Button variant="ghost" onClick={() => handleSort('name')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left p-4 font-medium">
                  <Button variant="ghost" onClick={() => handleSort('price')}>
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left p-4 font-medium">
                  <Button variant="ghost" onClick={() => handleSort('stock')}>
                    Stock
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">${formatPrice(product.price)}</td>
                  <td className="p-4">
                    <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteProductId(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AdminProtection(ProductManagement);