
import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock data for cart items
const initialCartItems = [
  {
    id: 1,
    name: "Crocus Cotton Tee",
    image: "https://via.placeholder.com/80x80",
    price: 29.99,
    quantity: 1,
    size: "M",
    color: "Crocus Purple",
    type: "product"
  },
  {
    id: 2,
    name: "Linen Blend Shirt",
    image: "https://via.placeholder.com/80x80",
    price: 49.99,
    quantity: 2,
    size: "L",
    color: "White",
    type: "product"
  },
  {
    id: 3,
    name: "Summer Dress",
    image: "https://via.placeholder.com/80x80",
    price: 79.99,
    quantity: 1,
    size: "S",
    color: "Floral",
    type: "product"
  },
  {
    id: 101,
    name: "Essential Capsule Combo",
    image: "https://via.placeholder.com/80x80",
    additionalImages: [
      "https://via.placeholder.com/80x80?text=Item1",
      "https://via.placeholder.com/80x80?text=Item2",
      "https://via.placeholder.com/80x80?text=Item3"
    ],
    price: 149.99,
    quantity: 1,
    description: "Crocus Purple blouse, neutral trousers, versatile blazer",
    type: "combo"
  },
  {
    id: 102,
    name: "Weekend Wanderer Combo",
    image: "https://via.placeholder.com/80x80",
    additionalImages: [
      "https://via.placeholder.com/80x80?text=Item1",
      "https://via.placeholder.com/80x80?text=Item2"
    ],
    price: 129.99,
    quantity: 1,
    description: "Comfortable jeans, layerable tops, statement jacket",
    type: "combo"
  }
];

interface CartItem {
  id: number;
  name: string;
  image: string;
  additionalImages?: string[];
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  description?: string;
  type: "product" | "combo";
}

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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
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
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              Size: {item.size} | Color: {item.color}
                            </p>
                            <p className="font-medium mt-1">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleQuantityChange(item.id, -1)}
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
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-500">
                                {item.description}
                              </p>
                              <p className="font-medium mt-1">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleQuantityChange(item.id, -1)}
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
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                                <span className="sr-only">Increase</span>
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                          {/* Combo items preview */}
                          {item.additionalImages && item.additionalImages.length > 0 && (
                            <div className="mt-3 pl-24">
                              <p className="text-xs text-gray-500 mb-2">Included items:</p>
                              <div className="flex gap-2">
                                {item.additionalImages.map((img, index) => (
                                  <div key={index} className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                    <img
                                      src={img}
                                      alt={`Item ${index+1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
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
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-crocus-500 hover:bg-crocus-600">
                  <Link to="/user/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
