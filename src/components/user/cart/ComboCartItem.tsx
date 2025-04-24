
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Minus, Plus, Trash } from "lucide-react";
import { CartItem } from "@/types/cart";

interface ComboCartItemProps {
  item: CartItem;
  onQuantityChange: (id: number, change: number) => void;
  onRemoveItem: (id: number) => void;
}

export const ComboCartItem = ({ item, onQuantityChange, onRemoveItem }: ComboCartItemProps) => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <AspectRatio ratio={16/9} className="w-32 overflow-hidden rounded-lg">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </AspectRatio>
        <div className="flex-1">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="font-medium mt-1">${item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="mx-3 w-6 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onQuantityChange(item.id, 1)}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500"
          onClick={() => onRemoveItem(item.id)}
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
      {item.additionalImages && item.additionalImages.length > 0 && (
        <div className="mt-3 pl-36">
          <p className="text-xs text-gray-500 mb-2">Included items:</p>
          <div className="flex gap-2">
            {item.additionalImages.map((img, index) => (
              <AspectRatio ratio={1} key={index} className="w-16 h-16 overflow-hidden rounded-lg">
                <img
                  src={img}
                  alt={`Item ${index+1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </AspectRatio>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
