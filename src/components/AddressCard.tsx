import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group"; // Assuming used within a RadioGroup
import { Label } from "@/components/ui/label";
import { Edit3, Trash2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other'; // e.g., Home, Work
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: (addressId: string) => void;
  onEdit?: (address: Address) => void;
  onDelete?: (addressId: string) => void;
  showActions?: boolean; // To hide edit/delete buttons if not needed
  className?: string;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  showActions = true,
  className,
}) => {
  console.log("Rendering AddressCard:", address.id, "Selected:", isSelected);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(address.id);
      console.log("Address selected:", address.id);
    }
  };

  return (
    <Card
      className={cn(
        "transition-all",
        isSelected ? "border-orange-500 ring-2 ring-orange-500" : "border-gray-200",
        onSelect ? "cursor-pointer hover:shadow-md" : "",
        className
      )}
      onClick={onSelect ? handleSelect : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-orange-500" />
          {address.type} Address {address.isDefault && <span className="ml-2 text-xs text-green-600">(Default)</span>}
        </CardTitle>
        {onSelect && (
          <RadioGroupItem
            value={address.id}
            id={`address-${address.id}`}
            checked={isSelected}
            aria-label={`Select address ${address.line1}`}
          />
        )}
      </CardHeader>
      <CardContent className="text-xs text-gray-700 space-y-1 pb-4">
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{address.city}, {address.state} {address.zip}</p>

        {showActions && (onEdit || onDelete) && (
          <div className="flex space-x-2 pt-3">
            {onEdit && (
              <Button
                variant="outline"
                size="xs"
                onClick={(e) => { e.stopPropagation(); onEdit(address); console.log("Edit address:", address.id); }}
                aria-label="Edit address"
              >
                <Edit3 className="h-3 w-3 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="xs"
                onClick={(e) => { e.stopPropagation(); onDelete(address.id); console.log("Delete address:", address.id); }}
                aria-label="Delete address"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default AddressCard;