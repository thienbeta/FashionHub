
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { 
  Heart,
  ShoppingCart
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock combo data
const combos = [
  {
    id: 1,
    name: "Crocus Summer Ensemble",
    price: 129.99,
    description: "The perfect summer collection featuring our most popular Crocus pieces, designed to mix and match for endless summer looks.",
    longDescription: "Get ready for summer with this carefully curated collection of our best-selling Crocus items. Each piece works beautifully together or can be styled separately for maximum versatility. The bundle includes our popular Crocus Satin Dress, Casual Tee, and Summer Outfit - all in complementary shades that embody the Pantone Color of the Year.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    images: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
    ],
    rating: 4.8,
    reviews: [
      { id: 1, user: "Madison K.", date: "April 2, 2025", rating: 5, comment: "Such great value! All three pieces work perfectly together and the quality is excellent." },
      { id: 2, user: "Ryan T.", date: "March 28, 2025", rating: 5, comment: "Bought this for my wife and she absolutely loves it. The colors are stunning in person." },
      { id: 3, user: "Jamie L.", date: "March 15, 2025", rating: 4, comment: "Great combo, though I wish there were more size options for the dress." }
    ],
    isFavorite: true,
    products: [
      {
        id: 1,
        name: "Crocus Satin Dress",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
      },
      {
        id: 2,
        name: "Crocus Casual Tee",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
      },
      {
        id: 5,
        name: "Crocus Summer Outfit",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
      }
    ],
    originalPrice: 129.97,
    savings: 29.98,
    savingsPercentage: 15
  }
];

// Mock related combos
const relatedCombos = [
  {
    id: 2,
    name: "Crocus Office Attire",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    rating: 4.6,
    isFavorite: false,
    productCount: 3
  },
  {
    id: 3,
    name: "Crocus Weekend Casual",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    rating: 4.7,
    isFavorite: false,
    productCount: 3
  }
];

const ComboDetail = () => {
  const { id } = useParams<{ id: string }>();
  const combo = combos.find(c => c.id === Number(id)) || combos[0];
  
  const [mainImage, setMainImage] = useState(combo.images[0]);
  const [quantity, setQuantity] = useState(1);

  const toggleFavorite = () => {
    // In a real app, this would update state or call an API
    console.log(`Toggle favorite for combo ${combo.id}`);
  };

  const addToCart = () => {
    // In a real app, this would add the combo to cart state or call an API
    console.log(`Added combo to cart: ${combo.name}, Quantity: ${quantity}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link to="/combos" className="text-crocus-600 hover:underline flex items-center gap-1">
          ← Back to Combos
        </Link>
      </div>

      {/* Combo Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Combo Images */}
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={mainImage} 
              alt={combo.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {combo.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(image)}
                className={`aspect-square rounded-md overflow-hidden ${mainImage === image ? 'ring-2 ring-crocus-500' : 'opacity-70'}`}
              >
                <img 
                  src={image} 
                  alt={`${combo.name} view ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Combo Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{combo.name}</h1>
              <Button 
                variant="ghost" 
                onClick={toggleFavorite}
                className="h-10 w-10 p-0"
              >
                <Heart className={`h-6 w-6 ${combo.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={i < Math.floor(combo.rating) ? "currentColor" : "none"}
                    stroke={i < Math.floor(combo.rating) ? "none" : "currentColor"}
                    className={`w-5 h-5 ${i < Math.floor(combo.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">{combo.rating} ({combo.reviews.length} reviews)</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-crocus-600">${combo.price.toFixed(2)}</p>
                <p className="text-sm line-through text-gray-500">${combo.originalPrice.toFixed(2)}</p>
              </div>
              <p className="text-green-600 font-medium">Save ${combo.savings.toFixed(2)} ({combo.savingsPercentage}% off)</p>
            </div>
          </div>

          <p className="text-gray-700">{combo.description}</p>

          {/* Items in Combo */}
          <div>
            <h3 className="font-medium mb-3">Included Items ({combo.products.length})</h3>
            <div className="space-y-3">
              {combo.products.map(product => (
                <div key={product.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-14 h-14 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-medium">
                      <Link to={`/products/${product.id}`} className="hover:text-crocus-600 transition-colors">
                        {product.name}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center border border-gray-200 rounded-md w-32">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-2 text-gray-500 hover:text-gray-700"
              >
                -
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-3 py-2 text-gray-500 hover:text-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <Button 
              onClick={addToCart}
              className="w-full bg-crocus-600 hover:bg-crocus-700"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add Combo to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Combo Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-4 border rounded-lg">
            <p className="text-gray-700">{combo.longDescription}</p>
          </TabsContent>
          <TabsContent value="reviews" className="p-4 border rounded-lg">
            <div className="space-y-4">
              {combo.reviews.map(review => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{review.user}</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill={i < review.rating ? "currentColor" : "none"}
                        stroke={i < review.rating ? "none" : "currentColor"}
                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Combos */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Similar Combos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {relatedCombos.map(combo => (
            <Card key={combo.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Link to={`/combos/${combo.id}`}>
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <button
                  onClick={() => console.log(`Toggle favorite for related combo ${combo.id}`)}
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
                  <h3 className="font-medium hover:text-crocus-600 transition-colors">{combo.name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-semibold">${combo.price.toFixed(2)}</p>
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
      </div>
    </div>
  );
};

export default ComboDetail;
