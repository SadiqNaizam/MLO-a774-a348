import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import Heading from '@/components/Heading';
import LiveOrderTracker, { OrderStatus } from '@/components/LiveOrderTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, History, RotateCcw, FileText } from 'lucide-react';

interface PastOrderItem {
  id: string;
  date: string;
  restaurantName: string;
  totalAmount: number;
  status: 'Delivered' | 'Cancelled';
  items: { name: string; quantity: number; price: number }[];
}

const activeOrdersData = [
  { orderId: 'ORD12345', currentStatus: 'OUT_FOR_DELIVERY' as OrderStatus, estimatedDeliveryTime: 'in 15 minutes' },
  { orderId: 'ORD67890', currentStatus: 'PREPARING' as OrderStatus, estimatedDeliveryTime: '4:30 PM - 4:45 PM' },
];

const pastOrdersData: PastOrderItem[] = [
  { id: 'ORD00001', date: '2023-10-25', restaurantName: 'Luigi\'s Pizzeria', totalAmount: 35.50, status: 'Delivered', items: [{ name: 'Pepperoni Pizza', quantity: 1, price: 18.00 }, { name: 'Coke', quantity: 2, price: 2.50 }] },
  { id: 'ORD00002', date: '2023-10-20', restaurantName: 'Burger Barn', totalAmount: 22.00, status: 'Delivered', items: [{ name: 'Cheeseburger', quantity: 2, price: 11.00 }] },
  { id: 'ORD00003', date: '2023-10-15', restaurantName: 'Sushi Central', totalAmount: 45.00, status: 'Cancelled', items: [{ name: 'Sushi Platter', quantity: 1, price: 45.00 }] },
];


const OrderManagementPage: React.FC = () => {
  console.log('OrderManagementPage loaded');
  // In a real app, fetch active and past orders
  const [activeOrders, setActiveOrders] = useState(activeOrdersData);
  const [pastOrders, setPastOrders] = useState(pastOrdersData);

  const handleReorder = (orderId: string) => {
    console.log("Reordering order:", orderId);
    // Add logic to repopulate cart with items from this order
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Heading level={1} className="mb-8 text-3xl font-bold text-center sm:text-left">My Orders</Heading>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Package className="mr-2 h-5 w-5" /> Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <History className="mr-2 h-5 w-5" /> Past Orders ({pastOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeOrders.length > 0 ? (
              <ScrollArea className="h-auto" style={{ maxHeight: '70vh' }}>
                <div className="space-y-6 p-1">
                  {activeOrders.map(order => (
                    <LiveOrderTracker
                      key={order.orderId}
                      orderId={order.orderId}
                      currentStatus={order.currentStatus}
                      estimatedDeliveryTime={order.estimatedDeliveryTime}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="mx-auto h-20 w-20 text-gray-300 mb-4" />
                  <p className="text-xl text-gray-600">No active orders right now.</p>
                  <p className="text-sm text-gray-500 mt-1">Why not place a new one?</p>
                  <Button className="mt-4" onClick={() => console.log("Browse Restaurants")}>Browse Restaurants</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastOrders.length > 0 ? (
              <ScrollArea className="h-auto" style={{ maxHeight: '70vh' }}>
                <Accordion type="single" collapsible className="w-full space-y-4 p-1">
                  {pastOrders.map(order => (
                    <AccordionItem value={order.id} key={order.id} className="bg-white rounded-lg shadow border">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <p className="font-semibold text-gray-800">{order.restaurantName}</p>
                            <p className="text-xs text-gray-500">Order ID: {order.id} &bull; {order.date}</p>
                          </div>
                          <div className="text-right">
                             <p className="font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</p>
                             <Badge variant={order.status === 'Delivered' ? 'default' : 'destructive'}
                                    className={order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                {order.status}
                             </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 pt-2 border-t">
                        <p className="text-sm font-medium mb-2 text-gray-700">Order Details:</p>
                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 mb-4">
                          {order.items.map(item => (
                            <li key={item.name}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)} each</li>
                          ))}
                        </ul>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleReorder(order.id)}>
                            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reorder
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => console.log("View receipt for:", order.id)}>
                            <FileText className="mr-1.5 h-3.5 w-3.5" /> View Receipt
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            ) : (
               <Card className="text-center py-12">
                <CardContent>
                  <History className="mx-auto h-20 w-20 text-gray-300 mb-4" />
                  <p className="text-xl text-gray-600">You have no past orders.</p>
                  <p className="text-sm text-gray-500 mt-1">Start ordering to see your history here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default OrderManagementPage;