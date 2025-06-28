import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/pages/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/pages/ui/tabs";
import { Card, CardContent } from "@/pages/ui/card";

type FavoriteItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  type: "sản phẩm" | "combo";
  productCount?: number;
};

const favoriteProducts: FavoriteItem[] = [
  {
    id: 2,
    name: "Áo thun Crocus phong cách thường ngày",
    price: 299000,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.8,
    type: "sản phẩm",
  },
  {
    id: 5,
    name: "Trang phục mùa hè Crocus",
    price: 399000,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: 4.2,
    type: "sản phẩm",
  },
  {
    id: 8,
    name: "Bộ đồ thể thao Crocus",
    price: 799000,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    rating: 4.5,
    type: "sản phẩm",
  },
];

const favoriteCombos: FavoriteItem[] = [
  {
    id: 1,
    name: "Combo mùa hè Crocus",
    price: 1299000,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    rating: 4.8,
    type: "combo",
    productCount: 3,
  },
  {
    id: 5,
    name: "Combo thể thao Crocus",
    price: 1499000,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.5,
    type: "combo",
    productCount: 2,
  },
];

const FavoritesList = () => {
  const [activeTab, setActiveTab] = useState("all");

  const displayItems: FavoriteItem[] =
    activeTab === "all"
      ? [...favoriteProducts, ...favoriteCombos]
      : activeTab === "products"
      ? favoriteProducts
      : favoriteCombos;

  const removeFromFavorites = (id: number, type: string) => {
    console.log(`Xóa ${type} với ID ${id} khỏi yêu thích`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Danh sách yêu thích</h1>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Trash2 size={16} />
          Xóa tất cả
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="all">
            Tất cả ({favoriteProducts.length + favoriteCombos.length})
          </TabsTrigger>
          <TabsTrigger value="products">
            Sản phẩm ({favoriteProducts.length})
          </TabsTrigger>
          <TabsTrigger value="combos">
            Combo ({favoriteCombos.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {displayItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-medium text-gray-600 mb-2">
            Bạn chưa yêu thích sản phẩm nào
          </h2>
          <p className="text-gray-500 mb-6">
            Những sản phẩm bạn đánh dấu yêu thích sẽ hiển thị tại đây để dễ dàng tìm lại.
          </p>
          <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
            <Link to="/products">Khám phá sản phẩm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="overflow-hidden group">
              <div className="relative aspect-square">
                <Link to={`/${item.type === "sản phẩm" ? "products" : "combos"}/${item.id}`}>
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
                {item.type === "combo" && item.productCount && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="inline-block bg-crocus-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {item.productCount} sản phẩm
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/${item.type === "sản phẩm" ? "products" : "combos"}/${item.id}`}
                    className="hover:text-crocus-600 transition-colors"
                  >
                    <h3 className="font-medium">{item.name}</h3>
                  </Link>
                  <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full capitalize">
                    {item.type}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-semibold">
                    {item.price.toLocaleString("vi-VN")}₫
                  </p>
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
