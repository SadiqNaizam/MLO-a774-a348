import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (id: string | number) => void; // Or pass full item details
  // Add props for customization options if needed, e.g., onCustomize
  className?: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  className,
}) => {
  console.log("Rendering MenuItemCard:", name);

  const handleAddToCartClick = () => {
    onAddToCart(id);
    console.log("Add to cart clicked for item:", name, id);
    // Potentially show a toast notification here using useToast hook
  };

  return (
    <Card className={`w-full flex flex-col sm:flex-row overflow-hidden transition-shadow duration-300 hover:shadow-lg ${className}`}>
      {imageUrl && (
        <div className="sm:w-1/3 flex-shrink-0">
          <AspectRatio ratio={4 / 3} className="sm:h-full">
            <img
              src={imageUrl}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails
            />
          </AspectRatio>
        </div>
      )}
      <div className="flex flex-col flex-grow">
        <CardHeader className={`pb-2 ${!imageUrl ? 'pt-4' : ''}`}>
          <CardTitle className="text-md font-semibold">{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow py-2">
          {description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {description}
            </p>
          )}
          <p className="text-sm font-bold text-orange-600">
            ${price.toFixed(2)}
          </p>
        </CardContent>
        <CardFooter className="pt-2 pb-3 px-4">
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleAddToCartClick}
            aria-label={`Add ${name} to cart`}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
          {/* Optionally, add a "Customize" button if applicable */}
        </CardFooter>
      </div>
    </Card>
  );
};
export default MenuItemCard;