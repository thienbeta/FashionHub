import { Button } from "@/pages/ui/button";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Package } from "lucide-react";
import { Card, CardContent } from "@/pages/ui/card";
import { BlogCard } from "@/pages/blogs/BlogCard";
import { useState } from "react";
import { CartItem } from "@/types/cart";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  isFavorite: boolean;
  sizes: string[];
  colors: string[];
  description: string;
}

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  authorImage: string;
  category: string;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Váy Lụa Crocus",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    rating: 4.5,
    isFavorite: false,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Tím", "Đen", "Trắng"],
    description: "Váy lụa sang trọng với màu tím Crocus đặc trưng."
  },
  {
    id: 2,
    name: "Áo Thun Crocus",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.8,
    isFavorite: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Tím", "Xám", "Trắng"],
    description: "Áo thun thoải mái hàng ngày với thiết kế Crocus tinh tế."
  },
  {
    id: 3,
    name: "Áo Khoác Crocus",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    rating: 4.7,
    isFavorite: false,
    sizes: ["S", "M", "L"],
    colors: ["Xanh Navy", "Đen"],
    description: "Áo khoác tinh tế với lớp lót lấy cảm hứng từ Crocus."
  },
  {
    id: 4,
    name: "Bộ Sưu Tập Denim Crocus",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    rating: 4.6,
    isFavorite: false,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Xanh Nhạt", "Xanh Đậm", "Đen"],
    description: "Denim cao cấp với đường may màu Crocus."
  },
  {
    id: 5,
    name: "Trang Phục Mùa Hè Crocus",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: 4.2,
    isFavorite: true,
    sizes: ["S", "M", "L"],
    colors: ["Tím Crocus", "Trắng", "Be"],
    description: "Trang phục nhẹ nhàng hoàn hảo cho những ngày hè ấm áp."
  },
  {
    id: 6,
    name: "Bộ Sưu Tập Mùa Đông Crocus",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    rating: 4.3,
    isFavorite: false,
    sizes: ["M", "L", "XL"],
    colors: ["Tím", "Trắng", "Xám"],
    description: "Giữ ấm và phong cách với bộ sưu tập mùa đông của chúng tôi."
  },
];

const featuredBlogs: Blog[] = [
  {
    id: "1",
    title: "Bộ Sưu Tập Hè 2025",
    excerpt: "Khám phá bộ sưu tập hè mới với xu hướng thời trang hot nhất cùng màu Pantone 2025.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=450",
    date: "15 Tháng 4, 2025",
    author: "Emma Nguyễn",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&h=60",
    category: "Sản Phẩm"
  },
  {
    id: "2",
    title: "Cách Phối Đồ Với Màu Tím Crocus",
    excerpt: "Học cách kết hợp màu Tím Crocus thịnh hành vào tủ quần áo của bạn trong mùa này.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=450",
    date: "10 Tháng 4, 2025",
    author: "Minh Trần",
    authorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=60&h=60",
    category: "Sản Phẩm"
  },
  {
    id: "3",
    title: "Kết Hợp Trang Phục Hoàn Hảo",
    excerpt: "Khám phá các kết hợp trang phục được tuyển chọn để nâng tầm phong cách của bạn.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&h=450",
    date: "5 Tháng 4, 2025",
    author: "Lan Anh",
    authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=60&h=60",
    category: "Combo"
  },
];

const Index = () => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quickViewProduct, setQuickViewProduct] = useState<number | null>(null);

  const addToCart = (item: Product) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
      type: "product",
      size: selectedSize || undefined,
      color: selectedColor || undefined
    };
    
    console.log("Đã thêm vào giỏ hàng:", cartItem);
    
    toast({
      title: "Đã Thêm Vào Giỏ Hàng",
      description: `${item.name} đã được thêm vào giỏ hàng của bạn.`,
    });
    
    setSelectedSize("");
    setSelectedColor("");
    setQuickViewProduct(null);
  };

  return (
    <div className="space-y-16 py-6">
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-crocus-500/20 to-crocus-200/40 rounded-xl p-8 md:p-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Khám Phá Bộ Sưu Tập <span className="bg-gradient-to-r from-crocus-500 to-crocus-700 bg-clip-text text-transparent">DearMoment</span> 2025
            </h1>
            <p className="text-lg text-gray-700 max-w-lg">
              Nâng tầm phong cách của bạn với sản phẩm hot nhất năm 2025. Bộ sưu tập mới của chúng tôi kết hợp sự thanh lịch với thiết kế đương đại.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
                <Link to="/products">Mua Sắm Ngay</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/products/new">Hàng Mới Về</Link>
              </Button>
              <Button asChild variant="outline" className="flex gap-2 items-center">
                <Link to="/user/cart">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Xem Giỏ Hàng</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img 
              src={featuredProducts[0].image} 
              alt={featuredProducts[0].name} 
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Chọn DearMoment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-crocus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-crocus-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Chất Lượng Cao Cấp</h3>
            <p className="text-gray-600">Được làm từ những chất liệu tốt nhất cho sự thoải mái và độ bền</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-crocus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-crocus-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Giao Hàng Nhanh</h3>
            <p className="text-gray-600">Vận chuyển nhanh chóng và đổi trả dễ dàng cho tất cả đơn hàng</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-crocus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-crocus-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Thời Trang Bền Vững</h3>
            <p className="text-gray-600">Quy trình và vật liệu thân thiện với môi trường cho một hành tinh tốt đẹp hơn</p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Sản Phẩm</h2>
          <Button asChild variant="link" className="text-crocus-600">
            <Link to="/products">Xem Tất Cả <span aria-hidden="true">→</span></Link>
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
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button 
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                    aria-label={product.isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                  >
                    <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                  </button>
                  <button
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                    aria-label="Xem nhanh"
                    onClick={() => setQuickViewProduct(product.id)}
                  >
                    <Package className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <Link to={`/products/${product.id}`} className="hover:text-crocus-600 transition-colors">
                  <h3 className="font-medium">{product.name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-800">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
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
                
                <Button asChild className="w-full mt-3 bg-crocus-500 hover:bg-crocus-600">
                  <Link to={`/products/${product.id}`}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> Xem Chi Tiết
                  </Link>
                </Button>
              </div>
              
              {quickViewProduct === product.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <Card className="w-full max-w-md overflow-hidden">
                    <div className="relative">
                      <button 
                        onClick={() => setQuickViewProduct(null)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-lg font-semibold mb-4">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      
                      <div className="space-y-4">
                        {product.sizes && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kích Cỡ</label>
                            <div className="flex flex-wrap gap-2">
                              {product.sizes.map((size) => (
                                <button
                                  key={size}
                                  className={`px-3 py-1 border rounded-md text-sm ${
                                    selectedSize === size 
                                      ? "border-crocus-500 bg-crocus-50 text-crocus-700" 
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                  onClick={() => setSelectedSize(size)}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {product.colors && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Màu Sắc</label>
                            <div className="flex flex-wrap gap-2">
                              {product.colors.map((color) => (
                                <button
                                  key={color}
                                  className={`px-3 py-1 border rounded-md text-sm ${
                                    selectedColor === color 
                                      ? "border-crocus-500 bg-crocus-50 text-crocus-700" 
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                  onClick={() => setSelectedColor(color)}
                                >
                                  {color}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          className="w-full mt-4 bg-crocus-500 hover:bg-crocus-600"
                          onClick={() => addToCart(product)}
                          disabled={product.sizes && !selectedSize}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" /> Thêm Vào Giỏ Hàng
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Bài Viết</h2>
          <Button asChild variant="link" className="text-crocus-600">
            <Link to="/blogs">Xem Tất Cả <span aria-hidden="true">→</span></Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBlogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      
      <section className="py-12 bg-crocus-50 rounded-xl">
        <div className="text-center max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Tin Tức</h2>
          <p className="text-gray-600 mb-6">
            Cập nhật các bộ sưu tập mới nhất và ưu đãi độc quyền
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-crocus-500"
            />
            <Button className="bg-crocus-500 hover:bg-crocus-600">
              Đăng Ký
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;