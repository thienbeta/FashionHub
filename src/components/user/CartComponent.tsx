import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCartItem } from "./cart/ProductCartItem";
import { ComboCartItem } from "./cart/ComboCartItem";
import { OrderSummary } from "./cart/OrderSummary";
import { EmptyCart } from "./cart/EmptyCart";
import { CartItem } from "@/types/cart";

// Mock data for cart items
const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Crocus Cotton Tee",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    price: 29.99,
    quantity: 1,
    size: "M",
    color: "Crocus Purple",
    type: "product" as const
  },
  {
    id: 2,
    name: "Linen Blend Shirt",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    price: 49.99,
    quantity: 2,
    size: "L",
    color: "White",
    type: "product" as const
  },
  {
    id: 3,
    name: "Summer Dress",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    price: 79.99,
    quantity: 1,
    size: "S",
    color: "Floral",
    type: "product" as const
  },
  {
    id: 101,
    name: "Essential Capsule Combo",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    additionalImages: [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
    ],
    price: 149.99,
    quantity: 1,
    description: "Crocus Purple blouse, neutral trousers, versatile blazer",
    type: "combo" as const
  },
  {
    id: 102,
    name: "Weekend Wanderer Combo",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    additionalImages: [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
    ],
    price: 129.99,
    quantity: 1,
    description: "Comfortable jeans, layerable tops, statement jacket",
    type: "combo" as const
  }
];

export const CartComponent = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-4">
                    {item.type === "product" ? (
                      <ProductCartItem
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                      />
                    ) : (
                      <ComboCartItem
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button variant="outline" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" onClick={() => setCartItems([])}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
};
