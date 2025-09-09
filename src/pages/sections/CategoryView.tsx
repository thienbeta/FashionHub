import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/pages/ui/carousel";
import { Link } from "react-router-dom";

enum TrangThai {
  HoatDong = 1,
  Khoa = 0
}

interface Loai {
  maDanhMuc: number;
  tenDanhMuc: string;
  hinhAnh?: string | null;
  ngayTao: string;
  trangThai: TrangThai;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";

const CategoryView = () => {
  const [loaiList, setLoaiList] = useState<Loai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoai = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/DanhMuc/filter/type/1`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Không tìm thấy dữ liệu loại.");
        if (response.status === 500) throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        throw new Error(`Lỗi HTTP! Mã trạng thái: ${response.status}`);
      }

      const data: Loai[] = await response.json();
      const activeCategories = data
        .filter(item => item.trangThai === TrangThai.HoatDong && item.tenDanhMuc);

      setLoaiList(activeCategories);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu loại:", error);
      setError("Không thể tải danh mục loại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoai();
  }, [fetchLoai]);

  const getImageSrc = (path?: string | null): string => {
    if (!path) return "/fallback-image.jpg";
    return `${API_URL}${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-500">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (loaiList.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-500">
        Không có danh mục loại để hiển thị
      </div>
    );
  }

  return (
    <section className="w-full py-2 bg-gradient-to-b from-[#f8f5ff] to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#9b87f5] mt-2 mb-3 text-center md:text-left">
          DANH MỤC
        </h2>
        <Carousel
          className="w-full max-w-[1800px] mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="gap-2">
            {loaiList.map((loai) => (
              <CarouselItem
                key={loai.maDanhMuc}
                className="basis-1/2 sm:basis-1/3 md:basis-1/6 lg:basis-1/12"
              >
                <div className="w-full text-center transition-all duration-300 hover:scale-105">
                  <Link
                    to={`/products?category=${encodeURIComponent(loai.tenDanhMuc || "")}`}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="relative w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto">
                      <img
                        src={getImageSrc(loai.hinhAnh)}
                        alt={loai.tenDanhMuc || "Danh mục"}
                        className="w-full h-full rounded-full object-cover border-2 border-[#9b87f5] transition-opacity duration-300 hover:opacity-90"
                        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                      />
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-700 line-clamp-2">
                      {loai.tenDanhMuc || "Không xác định"}
                    </p>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white text-[#9b87f5] p-2 rounded-full hover:bg-[#9b87f5]/20 transition-colors z-20" />
          <CarouselNext className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#9b87f5] p-2 rounded-full hover:bg-[#9b87f5]/20 transition-colors z-20" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryView;