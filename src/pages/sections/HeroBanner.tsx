import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/pages/ui/button";

interface FeaturedProduct {
  name: string;
  image: string;
}

interface HeroBannerProps {
  featuredProducts: FeaturedProduct[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ featuredProducts }) => {
  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-crocus-500/20 to-crocus-200/40 rounded-xl p-8 md:p-16 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Khám Phá Bộ Sưu Tập{" "}
            <span className="bg-gradient-to-r from-crocus-500 to-crocus-700 bg-clip-text text-transparent">
              DearMoment
            </span>{" "}
            2025
          </h1>
          <p className="text-lg text-gray-700 max-w-lg">
            Nâng tầm phong cách của bạn với sản phẩm hot nhất năm 2025. Bộ sưu
            tập mới của chúng tôi kết hợp sự thanh lịch với thiết kế đương đại.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
              <Link to="/products">Mua Sắm Ngay</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products/new">Hàng Mới Về</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex gap-2 items-center"
            >
              <Link to="/user/cart">
                <ShoppingCart className="h-4 w-4" />
                <span>Xem Giỏ Hàng</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src={featuredProducts[0].image}
            alt={featuredProducts[0].name}
            className="w-full h-[300px] object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
