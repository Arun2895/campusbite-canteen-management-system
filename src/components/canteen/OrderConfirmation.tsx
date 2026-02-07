import { CheckCircle, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order } from '@/types/canteen';

interface OrderConfirmationProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewOrder: () => void;
}

export function OrderConfirmation({
  order,
  open,
  onOpenChange,
  onNewOrder,
}: OrderConfirmationProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-label="Order confirmation">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-scale-in">
            <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
          </div>
          <DialogTitle className="text-2xl">Order Confirmed!</DialogTitle>
          <DialogDescription>
            Your order has been placed successfully
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Counter Number - Main focus */}
          <div 
            className="rounded-2xl bg-accent p-6 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-medium text-accent-foreground mb-1">
              Collect at Counter
            </p>
            <p className="text-5xl font-bold text-primary">
              #{order.counterNumber}
            </p>
          </div>

          {/* Order details */}
          <div className="space-y-3 rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>Estimated wait: 5-10 minutes</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>Pick up at the main counter</span>
            </div>
          </div>

          {/* Order summary */}
          <div className="space-y-2">
            <h4 className="font-medium">Order Summary</h4>
            <div className="space-y-1 text-sm" role="list" aria-label="Ordered items">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between" role="listitem">
                  <span className="text-muted-foreground">
                    {item.quantity}× {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total Paid</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={onNewOrder}>
          Place New Order
        </Button>
      </DialogContent>
    </Dialog>
  );
}
