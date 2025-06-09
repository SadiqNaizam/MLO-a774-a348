import React from 'react';
import { Badge } from '@/components/ui/badge'; // Using Badge as a base
import { cn } from '@/lib/utils';

interface CuisineCategoryPillProps {
  categoryName: string;
  isActive?: boolean;
  onClick?: (categoryName: string) => void;
  className?: string;
}

const CuisineCategoryPill: React.FC<CuisineCategoryPillProps> = ({
  categoryName,
  isActive = false,
  onClick,
  className,
}) => {
  console.log("Rendering CuisineCategoryPill:", categoryName, "Active:", isActive);

  const handleClick = () => {
    if (onClick) {
      onClick(categoryName);
      console.log("Cuisine pill clicked:", categoryName);
    }
  };

  return (
    <Badge
      variant={isActive ? 'default' : 'outline'}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md text-sm px-3 py-1.5 rounded-full",
        isActive ? "bg-orange-500 text-white hover:bg-orange-600" : "text-gray-700 hover:bg-gray-100 hover:border-gray-300",
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {categoryName}
    </Badge>
  );
};
export default CuisineCategoryPill;