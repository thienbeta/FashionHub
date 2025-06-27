
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

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
    sizes: ["XS", "S", "M", "L", "XL"],
    brand: "Crocus",
    type: "Dress",
    dateAdded: new Date("2025-03-01")
  },
  {
    id: 2,
    name: "Crocus Casual Tee",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.8,
    isFavorite: true,
    colors: ["Crocus Purple", "Gray", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    brand: "Crocus",
    type: "Top",
    dateAdded: new Date("2025-03-15")
  },
  {
    id: 3,
    name: "Crocus Formal Blazer",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    rating: 4.7,
    isFavorite: false,
    colors: ["Navy", "Crocus Purple", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    brand: "Crocus",
    type: "Outerwear",
    dateAdded: new Date("2025-02-20")
  },
  {
    id: 4,
    name: "Crocus Denim Collection",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    rating: 4.6,
    isFavorite: false,
    colors: ["Blue", "Black", "Light Blue"],
    sizes: ["28", "30", "32", "34", "36"],
    brand: "Crocus",
    type: "Bottom",
    dateAdded: new Date("2025-01-10")
  },
  {
    id: 5,
    name: "Crocus Summer Outfit",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: 4.2,
    isFavorite: true,
    colors: ["Crocus Purple", "White", "Beige"],
    sizes: ["XS", "S", "M", "L"],
    brand: "Summer Breeze",
    type: "Dress",
    dateAdded: new Date("2025-04-05")
  },
  {
    id: 6,
    name: "Crocus Winter Collection",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    rating: 4.3,
    isFavorite: false,
    colors: ["Crocus Purple", "Gray", "Black"],
    sizes: ["S", "M", "L", "XL"],
    brand: "Winter Luxe",
    type: "Outerwear",
    dateAdded: new Date("2025-01-05")
  },
  {
    id: 7,
    name: "Crocus Evening Gown",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    rating: 4.9,
    isFavorite: false,
    colors: ["Crocus Purple", "Gold", "Silver"],
    sizes: ["XS", "S", "M", "L", "XL"],
    brand: "Crocus",
    type: "Dress",
    dateAdded: new Date("2025-02-14")
  },
  {
    id: 8,
    name: "Crocus Athleisure Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    rating: 4.5,
    isFavorite: true,
    colors: ["Black", "Crocus Purple", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
    brand: "Urban Style",
    type: "Athleisure",
    dateAdded: new Date("2025-03-22")
  }
];

const ProductList = () => {
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState("name_asc");

  // Get unique colors and sizes for filters
  const uniqueColors = useMemo(() => 
    [...new Set(products.flatMap(product => product.colors))].sort(),
    []
  );
  
  const uniqueSizes = useMemo(() => 
    [...new Set(products.flatMap(product => product.sizes))].sort(),
    []
  );

  // Min and max prices for range slider
  const minPrice = useMemo(() => 
    Math.floor(Math.min(...products.map(p => p.price))),
    []
  );
  
  const maxPrice = useMemo(() => 
    Math.ceil(Math.max(...products.map(p => p.price))),
    []
  );

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedColor("");
    setSelectedSize("");
    setSelectedBrand("");
    setSelectedType("");
    setPriceRange([0, 0]);
    setSortBy("name_asc");
    toast({
      title: "Filters reset",
      description: "All filters have been reset to default values.",
    });
  };

  // Apply filters function for mobile
  const applyFilters = () => {
    toast({
      title: "Filters applied",
      description: "Your product filters have been applied.",
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Search term filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Color filter
      const matchesColor = selectedColor ? product.colors.includes(selectedColor) : true;
      
      // Size filter
      const matchesSize = selectedSize ? product.sizes.includes(selectedSize) : true;
      
      // Brand filter
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      
      // Type filter
      const matchesType = selectedType ? product.type === selectedType : true;
      
      // Price range filter
      const minPriceFilter = priceRange[0] > 0 ? product.price >= priceRange[0] : true;
      const maxPriceFilter = priceRange[1] > 0 ? product.price <= priceRange[1] : true;
      
      return matchesSearch && matchesColor && matchesSize && matchesBrand && 
             matchesType && minPriceFilter && maxPriceFilter;
    });
    
    // Sort products
    switch (sortBy) {
      case "name_asc":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case "price_asc":
        return result.sort((a, b) => a.price - b.price);
      case "price_desc":
        return result.sort((a, b) => b.price - a.price);
      case "rating_desc":
        return result.sort((a, b) => b.rating - a.rating);
      case "newest":
        return result.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
      default:
        return result;
    }
  }, [searchTerm, selectedColor, selectedSize, selectedBrand, selectedType, priceRange, sortBy]);

  const toggleFavorite = (productId: number) => {
    // In a real app, this would update state or call an API
    console.log(`Toggle favorite for product ${productId}`);
    
    toast({
      title: "Favorites updated",
      description: "Your favorites list has been updated.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>


      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={resetFilters}>Reset All Filters</Button>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4">
            <p className="text-gray-600">{filteredProducts.length} products found</p>
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
        </>
      )}
    </div>
  );
};

export default ProductList;
