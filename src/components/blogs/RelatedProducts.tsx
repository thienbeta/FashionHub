
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

// Mock product data
const products = [
  {
    id: 1,
    name: "Crocus Cotton Tee",
    price: 29.99,
    image: "https://via.placeholder.com/300x300",
    description: "Essential summer staple with a modern twist"
  },
  {
    id: 2,
    name: "Linen Blend Shirt",
    price: 49.99,
    image: "https://via.placeholder.com/300x300",
    description: "Effortlessly elegant for both casual and semi-formal occasions"
  },
  {
    id: 3,
    name: "Summer Dress",
    price: 79.99,
    image: "https://via.placeholder.com/300x300",
    description: "Perfect for beach outings or city explorations"
  },
  {
    id: 4,
    name: "Recycled Denim Jacket",
    price: 89.99,
    image: "https://via.placeholder.com/300x300",
    description: "Sustainable fashion that doesn't compromise on style"
  }
];

// Mock combo data
const combos = [
  {
    id: 1,
    name: "Essential Capsule",
    price: 149.99,
    image: "https://via.placeholder.com/300x300",
    description: "Create over 10 different outfits with this versatile combo"
  },
  {
    id: 2,
    name: "Weekend Wanderer",
    price: 129.99,
    image: "https://via.placeholder.com/300x300",
    description: "Perfect for casual days with comfortable, layerable pieces"
  },
  {
    id: 3,
    name: "Work-to-Weekend",
    price: 179.99,
    image: "https://via.placeholder.com/300x300",
    description: "Transition smoothly from office hours to evening outings"
  },
  {
    id: 4,
    name: "Summer Essentials",
    price: 119.99,
    image: "https://via.placeholder.com/300x300",
    description: "Stay cool and stylish with these summer must-haves"
  }
];

interface RelatedProductsProps {
  ids: number[];
  type: "product" | "combo";
}

export const RelatedProducts = ({ ids, type }: RelatedProductsProps) => {
  const items = type === "product" 
    ? products.filter(p => ids.includes(p.id))
    : combos.filter(c => ids.includes(c.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <Link to={`/${type}s/${item.id}`}>
            <div className="aspect-square w-full overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </Link>
          <CardContent className="pt-4">
            <Link to={`/${type}s/${item.id}`} className="hover:text-crocus-600 transition-colors">
              <h3 className="font-medium mb-1">{item.name}</h3>
            </Link>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <p className="font-medium text-lg">${item.price}</p>
          </CardContent>
          <CardFooter className="flex gap-2 border-t pt-4">
            <Button className="flex-1 bg-crocus-500 hover:bg-crocus-600">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
