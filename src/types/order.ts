interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  userId: number;
  productsId: number[];
  status: 'Pending' | 'Processing' | 'Shipped' | 'Cancelled';
  totalPrice: string;
  shippingAddress: string;
  createdAt: string;
  orderItems: OrderItem[];
}