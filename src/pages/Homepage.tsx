import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import CuisineCategoryPill from '@/components/CuisineCategoryPill';
import RestaurantCard from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Search, MapPin } from 'lucide-react';

const placeholderCuisines = ["All", "Pizza", "Burgers", "Sushi", "Italian", "Mexican", "Indian", "Chinese"];
const placeholderRestaurants = [
  { id: '1', name: 'Luigi\'s Pizzeria', imageUrl: 'https://source.unsplash.com/random/400x225/?food,pizza', cuisineTypes: ['Pizza', 'Italian'], rating: 4.5, deliveryTime: '25-35 min', priceRange: '$$' },
  { id: '2', name: 'Burger Barn', imageUrl: 'https://source.unsplash.com/random/400x225/?food,burger', cuisineTypes: ['Burgers', 'American'], rating: 4.2, deliveryTime: '20-30 min', priceRange: '$$' },
  { id: '3', name: 'Sushi Central', imageUrl: 'https://source.unsplash.com/random/400x225/?food,sushi', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min', priceRange: '$$$' },
  { id: '4', name: 'Taco Town', imageUrl: 'https://source.unsplash.com/random/400x225/?food,tacos', cuisineTypes: ['Mexican'], rating: 4.3, deliveryTime: '20-30 min', priceRange: '$' },
  { id: '5', name: 'Curry House', imageUrl: 'https://source.unsplash.com/random/400x225/?food,curry', cuisineTypes: ['Indian'], rating: 4.6, deliveryTime: '35-45 min', priceRange: '$$' },
];

const Homepage: React.FC = () => {
  console.log('Homepage loaded');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('New York, NY');
  const [activeCuisine, setActiveCuisine] = useState('All');

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search logic
  };

  const handleRestaurantClick = (id: string | number) => {
    console.log('Restaurant clicked:', id);
    // Navigate to restaurant page, e.g., using react-router-dom useNavigate()
    // navigate(`/restaurants/${id}`);
  };

  const filteredRestaurants = placeholderRestaurants.filter(restaurant =>
    activeCuisine === 'All' || restaurant.cuisineTypes.includes(activeCuisine)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu onSearch={handleSearch} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section / Location & Main Search */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Favorite Food, Delivered Fast
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Enter your delivery address to find restaurants near you.
          </p>
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 mb-8">
            <div className="relative flex-grow">
              <Label htmlFor="location" className="sr-only">Delivery Location</Label>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="location"
                type="text"
                placeholder="Enter your delivery address"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button size="lg" className="h-12 bg-orange-500 hover:bg-orange-600 text-white">
              <Search className="mr-2 h-5 w-5" /> Find Food
            </Button>
          </div>
        </section>

        {/* Cuisine Filter Pills */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Explore Cuisines</h2>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-3 pb-4">
              {placeholderCuisines.map(cuisine => (
                <CuisineCategoryPill
                  key={cuisine}
                  categoryName={cuisine}
                  isActive={activeCuisine === cuisine}
                  onClick={() => setActiveCuisine(cuisine)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Restaurant Listing Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            {activeCuisine === 'All' ? 'Popular Restaurants' : `${activeCuisine} Restaurants`}
          </h2>
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  {...restaurant}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No restaurants found for "{activeCuisine}". Try another cuisine!</p>
          )}
        </section>

        {/* Promotional Banner Example */}
        <section className="mt-12">
            <div className="bg-orange-100 p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-orange-700">Get 20% Off Your First Order!</h3>
                    <p className="text-orange-600 mt-1">Use code <span className="font-semibold">FIRSTBITE20</span> at checkout.</p>
                </div>
                <Button className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600 text-white">Order Now</Button>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Homepage;