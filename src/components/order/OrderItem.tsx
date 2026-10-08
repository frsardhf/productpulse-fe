import { Calendar, MapPin, Package } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/types/order";

interface OrderItemProps {
  readonly order: Order;
  readonly highlighted?: boolean;
}

function statusVariant(status: string): BadgeProps["variant"] {
  switch (status.toLowerCase()) {
    case "processing":
      return "processing";
    case "shipped":
      return "shipped";
    case "delivered":
      return "delivered";
    case "cancelled":
      return "cancelled";
    default:
      return "secondary";
  }
}

export default function OrderItem({ order, highlighted }: OrderItemProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <Card
      className={
        highlighted ? "border-primary ring-2 ring-primary/15" : undefined
      }
    >
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              <Badge variant={statusVariant(order.status)}>
                {order.status.toLowerCase()}
              </Badge>
              {highlighted && <Badge variant="outline">Just confirmed</Badge>}
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <time dateTime={order.createdAt}>{formattedDate}</time>
            </div>
            {order.shippingAddress && (
              <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="break-words">{order.shippingAddress}</span>
              </div>
            )}
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Demo total
            </p>
            <p className="text-2xl font-bold">
              ${Number(order.totalPrice).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t pt-4">
          <h3 className="text-sm font-semibold">Order items</h3>
          <div className="mt-3 space-y-2">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">
                      {item.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × ${Number(item.price).toFixed(2)} ·
                      Product #{item.productId}
                    </p>
                  </div>
                </div>
                <p className="pl-7 font-semibold sm:pl-0">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Item names and unit prices are preserved from the time of checkout.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
