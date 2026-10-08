export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  userId: number;
  productsId: number[];
  status: string;
  totalPrice: string;
  shippingAddress: string | null;
  createdAt: string;
  orderItems: OrderItem[];
}
