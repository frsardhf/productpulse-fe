  export interface CartItemType {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    quantity: number;
  }

  export interface CartItem {
    id: number;
    name: string;
    quantity: number;
    price: string;
  }
