
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyCart = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-gray-100 mx-auto rounded-full w-24 h-24 flex items-center justify-center mb-6">
        <ShoppingBag className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet.
        Browse our products and find something you'll love!
      </p>
      <Button asChild className="bg-crocus-500 hover:bg-crocus-600 rounded-full px-6">
        <Link to="/products" className="flex items-center gap-2">
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};
