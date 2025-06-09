import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import Heading from '@/components/Heading';
import AddressCard, { Address } from '@/components/AddressCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form'; // Assuming form structure from shadcn
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const addressSchema = z.object({
  type: z.enum(["Home", "Work", "Other"]),
  line1: z.string().min(5, "Street address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "Zip code is required").regex(/^\d{5}(-\d{4})?$/, "Invalid zip code"),
});

const checkoutFormSchema = z.object({
  deliveryAddressId: z.string().min(1, "Please select a delivery address."),
  paymentMethod: z.enum(["creditCard", "paypal", "cod"], { required_error: "Please select a payment method."}),
  // Conditional fields for credit card
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
}).refine(data => {
  if (data.paymentMethod === "creditCard") {
    return !!data.cardNumber && data.cardNumber.length === 16 && !!data.cardExpiry && !!data.cardCvc && data.cardCvc.length === 3;
  }
  return true;
}, {
  message: "Please provide valid credit card details.",
  path: ["cardNumber"], // Or a more general path
});


const placeholderAddresses: Address[] = [
  { id: 'addr1', type: 'Home', line1: '123 Main St', city: 'Anytown', state: 'CA', zip: '90210', isDefault: true },
  { id: 'addr2', type: 'Work', line1: '456 Office Park', city: 'Anytown', state: 'CA', zip: '90211' },
];

// Example cart total from a previous step or context
const orderTotalFromCart = 125.99;

const CheckoutPage: React.FC = () => {
  console.log('CheckoutPage loaded');
  const [addresses, setAddresses] = useState<Address[]>(placeholderAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(placeholderAddresses.find(a => a.isDefault)?.id || placeholderAddresses[0]?.id || '');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      deliveryAddressId: selectedAddressId,
      paymentMethod: undefined,
    },
  });
  
  const paymentMethod = form.watch("paymentMethod");

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    form.setValue("deliveryAddressId", addressId);
    console.log("Selected address:", addressId);
  };

  const onSubmit = (data: z.infer<typeof checkoutFormSchema>) => {
    console.log('Checkout form submitted:', data);
    // Process order
  };
  
  // New address form state (simplified)
  const newAddressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: { type: "Home", line1: "", line2: "", city: "", state: "", zip: ""},
  });

  const handleAddNewAddress = (data: z.infer<typeof addressSchema>) => {
    const newAddress: Address = { ...data, id: `addr${Date.now()}` };
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    form.setValue("deliveryAddressId", newAddress.id);
    setShowNewAddressForm(false);
    newAddressForm.reset();
    console.log("New address added:", newAddress);
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Heading level={1} className="mb-8 text-3xl font-bold text-center">Complete Your Order</Heading>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Address & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address Section */}
              <Card>
                <CardHeader>
                  <CardTitle>1. Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="deliveryAddressId"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleAddressSelect(value);
                        }}
                        className="space-y-3"
                      >
                        {addresses.map(addr => (
                          <FormItem key={addr.id}>
                            <Label htmlFor={`addr-${addr.id}`} className="block w-full">
                                <AddressCard
                                    address={addr}
                                    isSelected={selectedAddressId === addr.id}
                                    // onSelect is handled by RadioGroup parent effectively
                                    onEdit={(a) => console.log("Edit:", a)} // Placeholder
                                    onDelete={(id) => setAddresses(current => current.filter(ad => ad.id !== id))} // Placeholder
                                />
                                 {/* Hidden radio for form control */}
                                <FormControl> 
                                     <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="sr-only" />
                                </FormControl>
                            </Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    )}
                  />
                   <FormMessage>{form.formState.errors.deliveryAddressId?.message}</FormMessage>


                  {showNewAddressForm ? (
                    <Card className="mt-4 p-4 border-dashed">
                      <Form {...newAddressForm}>
                        <form onSubmit={newAddressForm.handleSubmit(handleAddNewAddress)} className="space-y-3">
                          <Heading level={3} className="text-lg">Add New Address</Heading>
                           <FormField control={newAddressForm.control} name="type" render={({field}) => (
                               <FormItem>
                                   <FormLabel>Address Type</FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                       <FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl>
                                       <SelectContent>
                                           <SelectItem value="Home">Home</SelectItem>
                                           <SelectItem value="Work">Work</SelectItem>
                                           <SelectItem value="Other">Other</SelectItem>
                                       </SelectContent>
                                   </Select>
                                   <FormMessage/>
                               </FormItem>
                           )}/>
                           <FormField control={newAddressForm.control} name="line1" render={({field}) => (<FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="123 Main St" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                           <FormField control={newAddressForm.control} name="line2" render={({field}) => (<FormItem><FormLabel>Address Line 2 (Optional)</FormLabel><FormControl><Input placeholder="Apt, suite, etc." {...field}/></FormControl><FormMessage/></FormItem>)}/>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                               <FormField control={newAddressForm.control} name="city" render={({field}) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                               <FormField control={newAddressForm.control} name="state" render={({field}) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="CA" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                               <FormField control={newAddressForm.control} name="zip" render={({field}) => (<FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input placeholder="90210" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                           </div>
                          <div className="flex gap-2">
                            <Button type="submit">Save Address</Button>
                            <Button variant="outline" onClick={() => {setShowNewAddressForm(false); newAddressForm.reset();}}>Cancel</Button>
                          </div>
                        </form>
                      </Form>
                    </Card>
                  ) : (
                    <Button variant="outline" onClick={() => setShowNewAddressForm(true)} className="w-full mt-2">
                      Add New Address
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method Section */}
              <Card>
                <CardHeader>
                  <CardTitle>2. Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                         <FormLabel className="text-base">Choose your payment method:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="creditCard" /></FormControl>
                              <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="paypal" /></FormControl>
                              <FormLabel className="font-normal">PayPal</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="cod" /></FormControl>
                              <FormLabel className="font-normal">Cash on Delivery (COD)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {paymentMethod === 'creditCard' && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                        <Heading level={4} className="text-md font-semibold">Enter Card Details</Heading>
                        <FormField control={form.control} name="cardNumber" render={({field}) => (<FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} maxLength={16}/></FormControl><FormMessage/></FormItem>)}/>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField control={form.control} name="cardExpiry" render={({field}) => (<FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <FormField control={form.control} name="cardCvc" render={({field}) => (<FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="•••" {...field} maxLength={3}/></FormControl><FormMessage/></FormItem>)}/>
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24"> {/* Sticky summary */}
                <CardHeader>
                  <CardTitle>3. Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* This should ideally list items from cart context/state */}
                  <div className="flex justify-between"><span>Margherita Pizza x 1</span><span>$12.99</span></div>
                  <div className="flex justify-between"><span>Garlic Bread x 2</span><span>$13.98</span></div>
                  <hr/>
                  <div className="flex justify-between"><span>Subtotal</span><span>$26.97</span></div>
                  <div className="flex justify-between"><span>Delivery</span><span>$5.00</span></div>
                  <div className="flex justify-between"><span>Tax (8%)</span><span>$2.56</span></div>
                  <hr/>
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${(orderTotalFromCart).toFixed(2)}</span> {/* Using static total for now */}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="lg">
                    Place Order (${(orderTotalFromCart).toFixed(2)})
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;