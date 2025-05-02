
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ComboFilters } from "@/components/filters/ComboFilters";
import { toast } from "@/hooks/use-toast";

// Mock combos data
const combos = [
  {
    id: 1,
    name: "Crocus Summer Ensemble",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    rating: 4.8,
    products: [1, 2, 5],
    isFavorite: true,
    productCount: 3,
    occasion: "Casual",
    dateAdded: new Date("2025-04-01")
  },
  {
    id: 2,
    name: "Crocus Office Attire",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    rating: 4.6,
    products: [3, 4, 6],
    isFavorite: false,
    productCount: 3,
    occasion: "Office",
    dateAdded: new Date("2025-03-15")
  },
  {
    id: 3,
    name: "Crocus Weekend Casual",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    rating: 4.7,
    products: [2, 4, 5],
    isFavorite: false,
    productCount: 3,
    occasion: "Weekend",
    dateAdded: new Date("2025-03-10")
  },
  {
    id: 4,
    name: "Crocus Evening Collection",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    rating: 4.9,
    products: [1, 7],
    isFavorite: false,
    productCount: 2,
    occasion: "Evening",
    dateAdded: new Date("2025-02-20")
  },
  {
    id: 5,
    name: "Crocus Athleisure Bundle",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.5,
    products: [5, 8],
    isFavorite: true,
    productCount: 2,
    occasion: "Athletic",
    dateAdded: new Date("2025-01-15")
  },
  {
    id: 6,
    name: "Crocus Complete Wardrobe",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    rating: 5.0,
    products: [1, 2, 3, 4, 6],
    isFavorite: false,
    productCount: 5,
    occasion: "Complete",
    dateAdded: new Date("2025-01-05")
  }
];

const CombosList = () => {
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [minItems, setMinItems] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState("name_asc");
  const [occasionType, setOccasionType] = useState("");

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setMinItems("");
    setPriceRange([0, 0]);
    setSortBy("name_asc");
    setOccasionType("");
    toast({
      title: "Filters reset",
      description: "All filters have been reset to default values.",
    });
  };

  // Apply filters function for mobile
  const applyFilters = () => {
    toast({
      title: "Filters applied",
      description: "Your combo filters have been applied.",
    });
  };

  // Filter and sort combos
  const filteredCombos = useMemo(() => {
    let result = combos.filter(combo => {
      // Search term filter
      const matchesSearch = combo.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Min items filter
      const matchesMinItems = minItems ? combo.productCount >= parseInt(minItems) : true;
      
      // Occasion type filter
      const matchesOccasion = occasionType ? combo.occasion === occasionType : true;
      
      // Price range filter
      const minPriceFilter = priceRange[0] > 0 ? combo.price >= priceRange[0] : true;
      const maxPriceFilter = priceRange[1] > 0 ? combo.price <= priceRange[1] : true;
      
      return matchesSearch && matchesMinItems && matchesOccasion && 
             minPriceFilter && maxPriceFilter;
    });
    
    // Sort combos
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
      case "items_desc":
        return result.sort((a, b) => b.productCount - a.productCount);
      default:
        return result;
    }
  }, [searchTerm, minItems, occasionType, priceRange, sortBy]);

  const toggleFavorite = (comboId: number) => {
    // In a real app, this would update state or call an API
    console.log(`Toggle favorite for combo ${comboId}`);
    toast({
      title: "Favorites updated",
      description: "Your favorites list has been updated.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Fashion Combos</h1>
      <p className="text-gray-600 mb-8">
        Discover our expertly curated fashion combinations that take the guesswork out of styling.
        Each combo offers a complete look at a special bundled price.
      </p>

      {/* Filters */}
      <div className="mb-8">
        <ComboFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          minItems={minItems}
          setMinItems={setMinItems}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          occasionType={occasionType}
          setOccasionType={setOccasionType}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
        />
      </div>

      {filteredCombos.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No combos found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-crocus-500 text-white rounded hover:bg-crocus-600"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4">
            <p className="text-gray-600">{filteredCombos.length} combos found</p>
          </div>
          
          {/* Combos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCombos.map((combo) => (
              <Card key={combo.id} className="overflow-hidden group">
                <div className="relative aspect-video">
                  <Link to={`/combos/${combo.id}`}>
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <button 
                    onClick={() => toggleFavorite(combo.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${combo.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="inline-block bg-crocus-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {combo.productCount} Items
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link to={`/combos/${combo.id}`}>
                    <h3 className="font-medium hover:text-crocus-600 transition-colors text-lg">{combo.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="font-semibold text-lg">${combo.price.toFixed(2)}</p>
                      <p className="text-sm text-green-600">Save 15%</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill={i < Math.floor(combo.rating) ? "currentColor" : "none"}
                          stroke={i < Math.floor(combo.rating) ? "none" : "currentColor"}
                          className={`w-4 h-4 ${i < Math.floor(combo.rating) ? "text-yellow-400" : "text-gray-300"}`}
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
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CombosList;
