import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import Heading from '@/components/Heading';
import MenuItemCard from '@/components/MenuItemCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Star, Clock, Percent, ShoppingCart } from 'lucide-react';

// Mock data structure
const mockRestaurantDetails = {
  id: '1',
  name: 'Luigi\'s Pizzeria',
  logoUrl: 'https://source.unsplash.com/random/100x100/?restaurant,logo,pizza',
  rating: 4.5,
  deliveryTime: '25-35 min',
  cuisine: 'Italian, Pizza',
  offers: ['20% off on orders over $50'],
  menu: {
    Appetizers: [
      { id: 'a1', name: 'Garlic Bread', description: 'Crusty bread with garlic butter and herbs.', price: 6.99, imageUrl: 'https://source.unsplash.com/random/200x150/?garlic,bread' },
      { id: 'a2', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil.', price: 8.50, imageUrl: 'https://source.unsplash.com/random/200x150/?caprese,salad' },
    ],
    Pizzas: [
      { id: 'p1', name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', price: 12.99, imageUrl: 'https://source.unsplash.com/random/200x150/?margherita,pizza' },
      { id: 'p2', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and mozzarella.', price: 14.99, imageUrl: 'https://source.unsplash.com/random/200x150/?pepperoni,pizza' },
      { id: 'p3', name: 'Veggie Supreme', description: 'A mix of fresh garden vegetables.', price: 15.50, imageUrl: 'https://source.unsplash.com/random/200x150/?veggie,pizza' },
    ],
    Desserts: [
      { id: 'd1', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert.', price: 7.00, imageUrl: 'https://source.unsplash.com/random/200x150/?tiramisu' },
    ],
  }
};

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

const RestaurantMenuPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  console.log('RestaurantMenuPage loaded for restaurant ID:', restaurantId);
  // In a real app, fetch restaurant details based on restaurantId
  const restaurant = mockRestaurantDetails; // Using mock data

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCustomizationSheetOpen, setIsCustomizationSheetOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);

  const handleAddToCart = (itemId: string | number) => {
    const itemToAdd = Object.values(restaurant.menu).flat().find(item => item.id === itemId);
    if (itemToAdd) {
      console.log('Adding to cart:', itemToAdd.name);
      // For simplicity, directly add to cart. Real app might open customization sheet.
      // setSelectedMenuItem(itemToAdd);
      // setIsCustomizationSheetOpen(true);
       setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === itemId);
        if (existingItem) {
          return prevCart.map(item => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prevCart, { ...itemToAdd, quantity: 1 }];
      });
      // Show toast notification
    }
  };

  const handleOpenCustomization = (item: any) => {
    setSelectedMenuItem(item);
    setIsCustomizationSheetOpen(true);
  };
  
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (!restaurant) {
    return <div>Restaurant not found.</div>; // Or a proper not found component
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border">
            <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
            <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <Heading level={1} className="text-3xl font-bold">{restaurant.name}</Heading>
            <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 text-sm text-gray-700">
              <span className="flex items-center"><Star className="h-4 w-4 text-yellow-500 mr-1" /> {restaurant.rating}</span>
              <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {restaurant.deliveryTime}</span>
            </div>
            {restaurant.offers && restaurant.offers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                {restaurant.offers.map((offer, index) => (
                  <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                    <Percent className="h-3 w-3 mr-1" /> {offer}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue={Object.keys(restaurant.menu)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:w-auto mb-6">
            {Object.keys(restaurant.menu).map(category => (
              <TabsTrigger key={category} value={category} className="flex-1 lg:flex-initial data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(restaurant.menu).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}> {/* Adjust maxHeight as needed */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                  {(items as any[]).map(item => (
                    <MenuItemCard
                      key={item.id}
                      {...item}
                      onAddToCart={() => handleAddToCart(item.id)} // Can also use handleOpenCustomization(item)
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Customization Sheet (Example) */}
      <Sheet open={isCustomizationSheetOpen} onOpenChange={setIsCustomizationSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Customize {selectedMenuItem?.name}</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <p>Customization options for {selectedMenuItem?.name} would go here.</p>
            {/* Example: <RadioGroup>, <Checkbox> for toppings, sizes etc. */}
            <Button onClick={() => { handleAddToCart(selectedMenuItem.id); setIsCustomizationSheetOpen(false); }} className="mt-4 w-full bg-orange-500 hover:bg-orange-600">
              Add to Cart
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Sticky Cart Button */}
      {totalCartItems > 0 && (
         <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:hidden">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { /* navigate to cart */ console.log("Go to cart")}}>
                <ShoppingCart className="mr-2 h-5 w-5" /> View Cart ({totalCartItems} items)
            </Button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantMenuPage;