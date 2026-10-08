import { create } from "zustand";
import api from "@/lib/axios";
import { loginUrlForCurrentPage, isSessionTokenValid } from "@/lib/session";
import { CartItemType } from "@/types/cart";
import { Product } from "@/types/product";

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

function requireSession(): void {
  const token = localStorage.getItem("token");
  if (!isSessionTokenValid(token)) {
    window.location.assign(loginUrlForCurrentPage());
    throw new Error("Authentication required");
  }
}

function normalizeCartItem(item: CartItemType): CartItemType {
  return { ...item, price: Number(item.price) };
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    if (!isSessionTokenValid(localStorage.getItem("token"))) {
      set({ items: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.get<CartItemType[]>("/cart/my-cart");
      set({
        items: response.data.map(normalizeCartItem),
        isLoading: false,
      });
    } catch {
      set({ error: "Failed to fetch cart items", isLoading: false });
    }
  },

  addToCart: async (id, quantity) => {
    requireSession();
    const productResponse = await api.get<Product>(`/products/${id}`);
    const product = {
      ...productResponse.data,
      price: Number(productResponse.data.price),
    };

    if (product.stock < quantity) {
      throw new Error("Not enough stock available");
    }

    await api.post("/cart/add", { productId: id, quantity });
    set((state) => {
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            quantity,
          },
        ],
      };
    });
  },

  updateQuantity: async (id, quantity) => {
    requireSession();
    await api.put(`/cart/${id}`, { quantity });
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    }));
  },

  removeFromCart: async (id) => {
    requireSession();
    await api.delete(`/cart/${id}`);
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  clearCart: () => set({ items: [], error: null }),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () =>
    get().items.reduce(
      (total, item) => total + item.quantity * Number(item.price),
      0,
    ),
}));
