import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ShoppingCart, UserCircle2 } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationMenuProps {
  logoText?: string;
  navItems?: NavItem[];
  onSearch?: (query: string) => void;
  // Add more props like user, cartItemCount as needed
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Orders', href: '/orders' },
];

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  logoText = "FoodApp",
  navItems = defaultNavItems,
  onSearch,
}) => {
  console.log("Rendering NavigationMenu");
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      console.log("Search submitted:", searchQuery);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-500">
            {logoText}
          </Link>

          {/* Desktop Search (optional, could be part of a hero section too) */}
          {onSearch && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-md mx-4">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search restaurants or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
          )}

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-600 hover:text-orange-500 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-6 w-6" />
                {/* Add a badge for cart item count if needed */}
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon" aria-label="Profile">
                <UserCircle2 className="h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center">
             <Link to="/cart" className="mr-2">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-6 w-6" />
              </Button>
            </Link>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>{logoText}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {onSearch && (
                    <form onSubmit={handleSearchSubmit} className="mb-4">
                      <Input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                       <Button type="submit" className="w-full mt-2">Search</Button>
                    </form>
                  )}
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                      </Link>
                    ))}
                     <Link
                        to="/profile"
                        className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <UserCircle2 className="inline h-5 w-5 mr-2" /> Profile
                      </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
       {/* Mobile Search (optional, displayed below nav or as part of hero) */}
       {onSearch && (
        <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search restaurants or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
        </div>
      )}
    </nav>
  );
};
export default NavigationMenu;