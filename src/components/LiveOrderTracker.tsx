import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Truck, Package, UtensilsCrossed, AlertCircle } from 'lucide-react'; // Example icons
import { Progress } from "@/components/ui/progress"; // Shadcn progress bar
import { cn } from '@/lib/utils';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'FAILED';

interface OrderStep {
  key: OrderStatus;
  label: string;
  icon: React.ElementType;
  completedText?: string;
  inProgressText?: string;
}

const orderSteps: OrderStep[] = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2, completedText: "Your order has been confirmed." },
  { key: 'PREPARING', label: 'Preparing Food', icon: UtensilsCrossed, completedText: "The restaurant is preparing your food." },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, completedText: "Your order is on its way!" },
  { key: 'DELIVERED', label: 'Delivered', icon: Package, completedText: "Enjoy your meal!" },
];

interface LiveOrderTrackerProps {
  currentStatus: OrderStatus;
  estimatedDeliveryTime?: string; // e.g., "4:30 PM - 4:45 PM" or "in 20 minutes"
  orderId: string;
  className?: string;
}

const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  currentStatus,
  estimatedDeliveryTime,
  orderId,
  className,
}) => {
  console.log("Rendering LiveOrderTracker for order:", orderId, "Status:", currentStatus);

  const currentStepIndex = orderSteps.findIndex(step => step.key === currentStatus);
  const progressValue = currentStepIndex >= 0 ? ((currentStepIndex + 1) / orderSteps.length) * 100 : 0;

  let statusMessage = "Tracking your order...";
  if (currentStatus === 'PENDING') statusMessage = "Awaiting confirmation from restaurant...";
  else if (currentStatus === 'CANCELLED') statusMessage = "This order has been cancelled.";
  else if (currentStatus === 'FAILED') statusMessage = "There was an issue with this order. Please contact support.";
  else if (currentStepIndex >= 0) {
    statusMessage = orderSteps[currentStepIndex].inProgressText || orderSteps[currentStepIndex].completedText || `Order is ${orderSteps[currentStepIndex].label.toLowerCase()}.`;
  }


  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Order Tracker (ID: {orderId})</CardTitle>
        {estimatedDeliveryTime && currentStatus !== 'DELIVERED' && currentStatus !== 'CANCELLED' && currentStatus !== 'FAILED' && (
          <p className="text-sm text-muted-foreground">
            Estimated Delivery: <span className="font-semibold text-orange-600">{estimatedDeliveryTime}</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {(currentStatus === 'CANCELLED' || currentStatus === 'FAILED') ? (
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-8 w-8 mr-3" />
            <p className="text-lg font-medium">{statusMessage}</p>
          </div>
        ) : (
          <>
            <Progress value={progressValue} className="w-full h-2" />
            <div className="flex justify-between space-x-2 sm:space-x-4">
              {orderSteps.map((step, index) => {
                const isCompleted = currentStepIndex >= index;
                const isActive = currentStepIndex === index;
                return (
                  <div key={step.key} className="flex flex-col items-center text-center flex-1">
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 mb-1 sm:mb-2 transition-all",
                        isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-gray-100 border-gray-300 text-gray-400",
                        isActive && !isCompleted && "border-orange-500 ring-2 ring-orange-300 text-orange-500"
                      )}
                    >
                      <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <p
                      className={cn(
                        "text-xs sm:text-sm font-medium",
                        isCompleted ? "text-green-600" : "text-gray-500",
                        isActive && !isCompleted && "text-orange-600"
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
             <p className="text-center text-sm text-gray-700 pt-2">{statusMessage}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
export default LiveOrderTracker;