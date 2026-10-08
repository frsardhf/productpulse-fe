import Link from "next/link";
import { PackageX } from "lucide-react";
import OrderItem from "@/components/order/OrderItem";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";

interface OrderListProps {
  readonly orders: Order[];
  readonly highlightedOrderId?: number;
}

export default function OrderList({
  orders,
  highlightedOrderId,
}: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border bg-white px-6 py-16 text-center shadow-sm">
        <PackageX className="mx-auto h-11 w-11 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">No demo orders yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Confirmed orders will appear here with their original item details.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          order={order}
          highlighted={order.id === highlightedOrderId}
        />
      ))}
    </div>
  );
}
