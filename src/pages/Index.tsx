
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    name: "Crocus Satin Dress",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    rating: 4.5,
    isFavorite: false
  },
  {
    id: 2,
    name: "Crocus Casual Tee",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.8,
    isFavorite: true
  },
  {
    id: 3,
    name: "Crocus Formal Blazer",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    rating: 4.7,
    isFavorite: false
  },
  {
    id: 4,
    name: "Crocus Denim Collection",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    rating: 4.6,
    isFavorite: false
  },
  {
    id: 5,
    name: "Crocus Summer Outfit",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: 4.2,
    isFavorite: true
  },
  {
    id: 6,
    name: "Crocus Winter Collection",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    rating: 4.3,
    isFavorite: false
  },
];

const trendingCombos = [
  {
    id: 1,
    name: "Crocus Summer Ensemble",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    rating: 4.8,
    products: [1, 2, 5],
    isFavorite: true
  },
  {
    id: 2,
    name: "Crocus Office Attire",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    rating: 4.6,
    products: [3, 4, 6],
    isFavorite: false
  },
  {
    id: 3,
    name: "Crocus Weekend Casual",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    rating: 4.7,
    products: [2, 4, 5],
    isFavorite: false
  },
];

const Index = () => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-crocus-500/20 to-crocus-200/40 rounded-xl p-8 md:p-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Discover the 2025 <span className="bg-gradient-to-r from-crocus-500 to-crocus-700 bg-clip-text text-transparent">Crocus</span> Collection
            </h1>
            <p className="text-lg text-gray-700 max-w-lg">
              Elevate your style with the hottest Pantone color of 2025. Our new collection blends elegance with contemporary designs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/products/new">New Arrivals</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Carousel className="w-full">
              <CarouselContent>
                {trendingCombos.map((combo) => (
                  <CarouselItem key={combo.id} className="md:basis-1/1">
                    <Link to={`/combos/${combo.id}`}>
                      <div className="relative rounded-lg overflow-hidden">
                        <img 
                          src={combo.image} 
                          alt={combo.name} 
                          className="w-full h-[300px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-xl text-white font-semibold">{combo.name}</h3>
                          <p className="text-white/80">${combo.price}</p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Crocus Fashion</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-crocus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-crocus-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Crafted with the finest materials for comfort and durability</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-crocus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-crocus-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick shipping and hassle-free returns on all orders</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-crocus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-crocus-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainable Fashion</h3>
            <p className="text-gray-600">Eco-friendly processes and materials for a better planet</p>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button asChild variant="link" className="text-crocus-600">
            <Link to="/products">View All <span aria-hidden="true">→</span></Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button 
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                  aria-label={product.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </button>
              </div>
              <div className="mt-3">
                <Link to={`/products/${product.id}`} className="hover:text-crocus-600 transition-colors">
                  <h3 className="font-medium">{product.name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-800">${product.price.toFixed(2)}</p>
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
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Trending Combos */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Combos</h2>
          <Button asChild variant="link" className="text-crocus-600">
            <Link to="/combos">View All <span aria-hidden="true">→</span></Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingCombos.map((combo) => (
            <div key={combo.id} className="group relative">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Link to={`/combos/${combo.id}`}>
                  <img 
                    src={combo.image} 
                    alt={combo.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button 
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                  aria-label={combo.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`h-5 w-5 ${combo.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </button>
              </div>
              <div className="mt-3">
                <Link to={`/combos/${combo.id}`} className="hover:text-crocus-600 transition-colors">
                  <h3 className="font-medium">{combo.name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-800">${combo.price.toFixed(2)}</p>
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
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-12 bg-crocus-50 rounded-xl">
        <div className="text-center max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">
            Stay updated with our latest collections and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-crocus-500"
            />
            <Button className="bg-crocus-500 hover:bg-crocus-600">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
