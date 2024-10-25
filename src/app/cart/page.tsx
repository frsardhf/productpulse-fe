// /src/app/cart/page.tsx
import React from 'react';
import Cart from '../../components/cart/Cart';

const CartPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <Cart />
    </main>
  );
};

export default CartPage;