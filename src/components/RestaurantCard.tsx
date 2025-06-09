import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock, DollarSign } from 'lucide-react'; // Example icons

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza"]
  rating?: number; // e.g., 4.5
  deliveryTime?: string; // e.g., "25-35 min"
  priceRange?: string; // e.g., "$$"
  onClick?: (id: string | number) => void;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  priceRange,
  onClick,
  className,
}) => {
  console.log("Rendering RestaurantCard:", name);

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
      console.log("RestaurantCard clicked:", id);
    }
  };

  return (
    <Card
      className={`w-full overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${className}`}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      tabIndex={0}
      aria-label={`View details for ${name}`}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
        <div className="text-xs text-gray-500 truncate">
          {cuisineTypes.join(', ')}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-700">
          {rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {deliveryTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{deliveryTime}</span>
            </div>
          )}
          {priceRange && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-0.5" />
              <span>{priceRange}</span>
            </div>
          )}
        </div>
      </CardContent>
      {cuisineTypes.length > 0 && (
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
          {cuisineTypes.slice(0, 3).map((cuisine) => ( // Show max 3 badges
            <Badge key={cuisine} variant="secondary" className="text-xs">
              {cuisine}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
};
export default RestaurantCard;