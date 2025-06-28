import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/pages/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/pages/ui/card";
import { 
  Heart,
  ShoppingCart
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/pages/ui/tabs";

// Mock product data
const products = [
  {
    id: 1,
    name: "Crocus Satin Dress",
    price: 59.99,
    description: "Elegant satin dress in the season's most coveted shade of Crocus. Perfect for evening events and special occasions.",
    longDescription: "This luxurious satin dress showcases the 2025 Pantone Color of the Year in all its glory. The fluid silhouette drapes beautifully while the adjustable straps ensure the perfect fit. Crafted from premium satin fabric with a subtle sheen that catches the light as you move.",
    specs: ["100% Premium Satin", "Adjustable straps", "Side slit", "Fully lined", "Dry clean only"],
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
    ],
    rating: 4.5,
    reviews: [
      { id: 1, user: "Emma S.", date: "March 15, 2025", rating: 5, comment: "Absolutely love this dress! The color is even more beautiful in person." },
      { id: 2, user: "Sophia T.", date: "March 10, 2025", rating: 4, comment: "Great quality, fits true to size. The satin is luxurious." },
      { id: 3, user: "Olivia R.", date: "March 5, 2025", rating: 5, comment: "Perfect for my event, received so many compliments!" }
    ],
    isFavorite: false,
    colors: ["Crocus Purple", "Black", "White"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  // Other products would be defined here
];

// Mock related products
const relatedProducts = [
  {
    id: 2,
    name: "Crocus Casual Tee",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.8,
    isFavorite: true
  },
  {
    id: 5,
    name: "Crocus Summer Outfit",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: 4.2,
    isFavorite: false
  },
  {
    id: 7,
    name: "Crocus Evening Gown",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    rating: 4.9,
    isFavorite: false
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === Number(id)) || products[0];
  
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  const toggleFavorite = () => {
    // In a real app, this would update state or call an API
    console.log(`Toggle favorite for product ${product.id}`);
  };

  const addToCart = () => {
    // In a real app, this would add the product to cart state or call an API
    console.log(`Added to cart: ${product.name}, Color: ${selectedColor}, Size: ${selectedSize}, Quantity: ${quantity}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link to="/products" className="text-crocus-600 hover:underline flex items-center gap-1">
          ← Back to Products
        </Link>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(image)}
                className={`aspect-square rounded-md overflow-hidden ${mainImage === image ? 'ring-2 ring-crocus-500' : 'opacity-70'}`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} view ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    stroke={i < Math.floor(product.rating) ? "none" : "currentColor"}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">{product.rating} ({product.reviews.length} reviews)</span>
            </div>
            <p className="text-2xl font-bold text-crocus-600 mt-2">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Color Selection */}
          <div>
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded-full border ${selectedColor === color 
                    ? 'border-crocus-500 bg-crocus-50 text-crocus-700' 
                    : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-medium mb-2">Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md border ${selectedSize === size 
                    ? 'border-crocus-500 bg-crocus-50 text-crocus-700' 
                    : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {size}
                </button>
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
          <div className="flex gap-3">
            <Button 
              onClick={addToCart}
              className="flex-1 bg-crocus-600 hover:bg-crocus-700"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button 
              variant="outline" 
              onClick={toggleFavorite}
              className="w-12"
            >
              <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-4 border rounded-lg">
            <p className="text-gray-700">{product.longDescription}</p>
          </TabsContent>
          <TabsContent value="specifications" className="p-4 border rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              {product.specs.map((spec, index) => (
                <li key={index} className="text-gray-700">{spec}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="p-4 border rounded-lg">
            <div className="space-y-4">
              {product.reviews.map(review => (
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

      {/* Related Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <button
                  onClick={() => console.log(`Toggle favorite for related product ${product.id}`)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
