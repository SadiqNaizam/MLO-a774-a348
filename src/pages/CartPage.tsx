import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Minus, Percent } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variant?: string; // e.g. "Large"
}

const initialCartItems: CartItem[] = [
  { id: 'p1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://source.unsplash.com/random/100x100/?margherita,pizza', variant: 'Regular' },
  { id: 'a1', name: 'Garlic Bread', price: 6.99, quantity: 2, imageUrl: 'https://source.unsplash.com/random/100x100/?garlic,bread' },
  { id: 'd1', name: 'Tiramisu', price: 7.00, quantity: 1, imageUrl: 'https://source.unsplash.com/random/100x100/?tiramisu' },
];

const CartPage: React.FC = () => {
  console.log('CartPage loaded');
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.08; // Example 8% tax
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example $5 delivery fee
  const discount = promoCode === 'FIRSTBITE20' ? subtotal * 0.20 : 0; // Example 20% discount
  const total = subtotal + estimatedTax + deliveryFee - discount;

  const handleApplyPromo = () => {
    console.log("Applying promo code:", promoCode);
    // Logic to validate and apply promo code would go here
    // For now, it just re-calculates total if code is "FIRSTBITE20"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Heading level={1} className="mb-8 text-3xl font-bold text-center sm:text-left">Your Shopping Cart</Heading>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <p className="text-xl text-gray-600 mb-2">Your cart is empty.</p>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => { /* navigate to homepage or restaurants page */ console.log("Go to shopping")}}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-auto max-h-[60vh]"> {/* Max height for scrollability */}
                    <Table>
                      <TableHeader className="hidden sm:table-header-group">
                        <TableRow>
                          <TableHead className="w-[100px]"></TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="p-2 sm:p-4">
                              <img src={item.imageUrl || 'https://source.unsplash.com/random/100x100/?food,placeholder'} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md" />
                            </TableCell>
                            <TableCell className="font-medium p-2 sm:p-4">
                                {item.name}
                                {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                            </TableCell>
                            <TableCell className="p-2 sm:p-4">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-center p-2 sm:p-4">
                              <div className="flex items-center justify-center space-x-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right p-2 sm:p-4">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell className="text-right p-2 sm:p-4">
                              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove item">
                                <Trash2 className="h-5 w-5 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Discount (FIRSTBITE20)</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="pt-2">
                    <Label htmlFor="promo" className="text-sm font-medium">Promotional Code</Label>
                    <div className="flex space-x-2 mt-1">
                        <Input
                            id="promo"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={handleApplyPromo}><Percent className="h-4 w-4 mr-1 sm:mr-2"/> Apply</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="lg" onClick={() => { /* navigate to checkout */ console.log("Proceed to checkout")}}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;