
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Mock favorites data
const favoriteProducts = [
  {
    id: 2,
    name: "Crocus Casual Tee",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.8,
    type: "product"
  },
  {
    id: 5,
    name: "Crocus Summer Outfit",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: 4.2,
    type: "product"
  },
  {
    id: 8,
    name: "Crocus Athleisure Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    rating: 4.5,
    type: "product"
  }
];

const favoriteCombos = [
  {
    id: 1,
    name: "Crocus Summer Ensemble",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    rating: 4.8,
    type: "combo",
    productCount: 3
  },
  {
    id: 5,
    name: "Crocus Athleisure Bundle",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.5,
    type: "combo",
    productCount: 2
  }
];

const FavoritesList = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter based on active tab
  const displayItems = activeTab === "all" 
    ? [...favoriteProducts, ...favoriteCombos]
    : activeTab === "products" 
      ? favoriteProducts 
      : favoriteCombos;

  const removeFromFavorites = (id: number, type: string) => {
    // In a real app, this would update state or call an API
    console.log(`Remove ${type} with ID ${id} from favorites`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <Button variant="outline" size="sm">
          Clear All
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All ({favoriteProducts.length + favoriteCombos.length})</TabsTrigger>
          <TabsTrigger value="products">Products ({favoriteProducts.length})</TabsTrigger>
          <TabsTrigger value="combos">Combos ({favoriteCombos.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {displayItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-medium text-gray-600 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">
            Items you favorite will appear here so you can easily find them later.
          </p>
          <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="overflow-hidden group">
              <div className="relative aspect-square">
                <Link to={`/${item.type}s/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <button 
                  onClick={() => removeFromFavorites(item.id, item.type)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-50 transition-colors group-hover:opacity-100"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
                {item.type === 'combo' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="inline-block bg-crocus-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {(item as any).productCount} Items
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Link to={`/${item.type}s/${item.id}`}>
                    <h3 className="font-medium hover:text-crocus-600 transition-colors">{item.name}</h3>
                  </Link>
                  <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full capitalize">
                    {item.type}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFromFavorites(item.id, item.type)}
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
