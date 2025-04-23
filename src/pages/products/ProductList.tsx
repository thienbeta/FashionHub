
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock product data
const products = [
  {
    id: 1,
    name: "Crocus Satin Dress",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    rating: 4.5,
    isFavorite: false,
    colors: ["Crocus Purple", "Black", "White"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Crocus Casual Tee",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.8,
    isFavorite: true,
    colors: ["Crocus Purple", "Gray", "Blue"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Crocus Formal Blazer",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    rating: 4.7,
    isFavorite: false,
    colors: ["Navy", "Crocus Purple", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "Crocus Denim Collection",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    rating: 4.6,
    isFavorite: false,
    colors: ["Blue", "Black", "Light Blue"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 5,
    name: "Crocus Summer Outfit",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: 4.2,
    isFavorite: true,
    colors: ["Crocus Purple", "White", "Beige"],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 6,
    name: "Crocus Winter Collection",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    rating: 4.3,
    isFavorite: false,
    colors: ["Crocus Purple", "Gray", "Black"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 7,
    name: "Crocus Evening Gown",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    rating: 4.9,
    isFavorite: false,
    colors: ["Crocus Purple", "Gold", "Silver"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 8,
    name: "Crocus Athleisure Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    rating: 4.5,
    isFavorite: true,
    colors: ["Black", "Crocus Purple", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"]
  }
];

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Get unique colors and sizes for filters
  const uniqueColors = [...new Set(products.flatMap(product => product.colors))];
  const uniqueSizes = [...new Set(products.flatMap(product => product.sizes))];

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = selectedColor ? product.colors.includes(selectedColor) : true;
    const matchesSize = selectedSize ? product.sizes.includes(selectedSize) : true;
    return matchesSearch && matchesColor && matchesSize;
  });

  const toggleFavorite = (productId: number) => {
    // In a real app, this would update state or call an API
    console.log(`Toggle favorite for product ${productId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <select 
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Colors</option>
          {uniqueColors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>

        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Sizes</option>
          {uniqueSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <button 
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
            </div>
            <CardContent className="p-4">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-medium hover:text-crocus-600 transition-colors">{product.name}</h3>
              </Link>
              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold">${product.price.toFixed(2)}</p>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                      stroke={i < Math.floor(product.rating) ? "none" : "currentColor"}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {product.colors.slice(0, 3).map(color => (
                  <span key={color} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full">{color}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
