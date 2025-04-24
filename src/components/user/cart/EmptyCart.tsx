
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyCart = () => {
  return (
    <div className="text-center py-12">
      <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
      <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
        <Link to="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
};
