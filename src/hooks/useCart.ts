import { create } from 'zustand';
import { Product } from '@/types/product';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { CartItemType } from '@/types/cart';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
  // Add other JWT payload fields if needed
}

interface CartState {
  items: CartItemType[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addToCart: (id: number, quantity: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Token has expired, remove it
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }

    return token;
  } catch (error) {
    // Invalid token format, remove it
    console.log(error)
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const handleAuthError = () => {
  localStorage.removeItem('token');
  const currentPath = window.location.pathname;
  console.log(currentPath)
  window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const token = getAuthToken();

      console.log(localStorage.getItem('user'))

      const response = await api.get('/cart/my-cart', {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json'
        }
      });
      const cartItems = response.data;
      set({ items: cartItems, isLoading: false });
      return cartItems;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        console.error('Authentication error:', error);
        handleAuthError();
        set({ items: [], isLoading: false });
        return [];
      }
      set({
        error: 'Failed to fetch cart items',
        isLoading: false
      });
      console.error('Error fetching cart items:', error);
      return [];
    }
  },
  
  addToCart: async (id: number, quantity: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        const currentPath = window.location.pathname;
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
        return;
      }
  
      const productResponse = await api.get(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const product: Product = productResponse.data;
  
      if (product.stock < quantity) {
        throw new Error('Not enough stock available');
      }
  
      const cartResponse = await api.post(
        '/cart/add',
        { productId: id, quantity: quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (cartResponse.status === 201) {
        set((state) => {
          const existingItem = state.items.find(item => item.id === id);
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, {
              id,
              name: product.name,
              description: product.description,
              price: product.price,
              stock: product.stock,
              categoryId: product.categoryId,
              quantity
            }]
          };
        });
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  },

  updateQuantity: async (id, quantity) => {
    try {
      const response = await api.put(`/cart/${id}`, { quantity });

      // If the update is successful, update the local state
      if (response.status === 200) {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        if (axiosError.response.status === 404) {
          console.error('Cart item not found:', axiosError.response.data.message);
        } else {
          console.error('Failed to update cart item quantity:', axiosError.response.data.message);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  },

  removeFromCart: async (id) => {
    try {
      const response = await api.delete(`/cart/${id}`);

      if (response.status === 200) {
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
        }));
        console.log('Cart item deleted successfully:', response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        if (axiosError.response.status === 404) {
          console.error('Cart item not found:', axiosError.response.data.message);
        } else {
          console.error('Failed to remove cart item:', axiosError.response.data.message);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.quantity * +item.price, 0);
  },
}));