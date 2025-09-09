import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Loader2, Bolt, Star, Search as SearchIcon, X, Sparkles } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150?text=No+Image";
const PLACEHOLDER_HASHTAG_IMAGE = "https://via.placeholder.com/40?text=Tag";
const PRODUCTS_PER_PAGE = 20;

interface Media {
  maMedia: number;
  loaiMedia: string;
  duongDan: string;
  altMedia: string | null;
  linkMedia: string | null;
  ngayTao: string;
  trangThai: number;
  maSanPham: number;
  tenSanPham: string;
  maBinhLuan: number | null;
}

interface BienThe {
  maBienThe: number;
  maSanPham: number;
  giaBan: number;
  giaNhap: number | null;
  soLuongNhap: number;
  soLuongBan: number;
  maMau: number;
  tenMau: string | null;
  maKichThuoc: number;
  tenKichThuoc: string | null;
  maVach: string | null;
  khuyenMai: number | null;
  giaTri: number;
  hinhAnh: string | null;
  trangThai: number;
  ngayTao: string;
  hinhAnhKichThuoc: string | null;
  hinhAnhMau: string | null;
}

interface SanPham {
  maSanPham: number;
  tenSanPham: string;
  moTa: string | null;
  slug: string | null;
  chatLieu: string | null;
  gioiTinh: number;
  maLoai: number;
  tenLoai: string | null;
  hinhAnhLoai: string | null;
  maThuongHieu: number;
  tenThuongHieu: string | null;
  hinhAnhThuongHieu: string | null;
  maHashtag: number | null;
  tenHashtag: string | null;
  hinhAnhHashtag: string | null;
  ngayTao: string;
  trangThai: number;
  medias: Media[];
  bienThes: BienThe[];
  tongSoLuongBan: number;
  tongSoLuongNhap: number;
  danhGiaTrungBinh: number | null;
  soLuongDanhGia: number;
}

const Search: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SanPham[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch search results
  const fetchSearchResults = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<SanPham[]>(`${API_URL}/api/SanPham/search`, {
        params: {
          tenSanPham: searchQuery,
          trangThai: 1,
        },
      });

      setSearchResults(response.data.slice(0, PRODUCTS_PER_PAGE));
      setError(null);
    } catch (error: any) {
      const errorMessage = error.response?.status === 400
        ? "Yêu cầu không hợp lệ."
        : error.response?.status === 500
          ? "Lỗi máy chủ, vui lòng thử lại sau."
          : "Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc thử lại sau.";
      setError(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorMessage,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isSearchOpen) {
        fetchSearchResults();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isSearchOpen, fetchSearchResults]);

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get price info for the lowest-priced variant
  const getPriceInfo = (product: SanPham): { giaTri: number; giaBan: number; khuyenMai: number | null } => {
    const variants = product.bienThes || [];
    if (variants.length === 0) {
      return { giaTri: 0, giaBan: 0, khuyenMai: null };
    }
    const lowestVariant = variants.reduce(
      (min, variant) => (variant.giaTri < min.giaTri ? variant : min),
      variants[0]
    );
    return {
      giaTri: lowestVariant.giaTri,
      giaBan: lowestVariant.giaBan,
      khuyenMai: lowestVariant.khuyenMai,
    };
  };

  // Get the first image for a product
  const getFirstImage = (product: SanPham): { url: string; alt: string } => {
    const firstMediaImage = product.medias.find(media => media.loaiMedia === "image" && media.trangThai === 1);
    if (firstMediaImage) {
      return {
        url: `${API_URL}${firstMediaImage.duongDan}`,
        alt: firstMediaImage.altMedia || product.tenSanPham,
      };
    }
    const firstVariantImage = product.bienThes.find(v => v.hinhAnh && v.trangThai === 1);
    if (firstVariantImage) {
      return {
        url: `${API_URL}${firstVariantImage.hinhAnh}`,
        alt: `${product.tenSanPham} - ${firstVariantImage.tenMau}`,
      };
    }
    return { url: PLACEHOLDER_IMAGE, alt: product.tenSanPham };
  };

  // Render star rating
  const renderStars = (rating: number | null) => {
    const stars = Math.round(rating || 0);
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < stars ? "fill-yellow-400 stroke-yellow-400" : "fill-none stroke-gray-300"}`}
      />
    ));
  };

  // Render progress bar for sales
  const renderProgressBar = (ban: number, nhap: number) => {
    const sold = ban || 0;
    const imported = nhap || 0;
    const percent = imported > 0 ? Math.min((sold / imported) * 100, 100) : 0;
    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Đã bán: {sold}</span>
          <span>Tổng: {imported}</span>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="relative bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse rounded-full" />
          </div>
        </div>
        <div className="text-sm text-red-500 font-bold mt-2 flex items-center gap-1">
          <span className="animate-bounce">🔥</span>
          <span className="animate-pulse">{percent.toFixed(1)}% ĐÃ BÁN - HOT SALE!</span>
          <span className="animate-bounce">🔥</span>
        </div>
      </div>
    );
  };

  const visibleProducts = searchResults.slice(0, PRODUCTS_PER_PAGE);

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <Button
        variant="ghost"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        aria-label={isSearchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
        className={cn(
          "flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg border",
          isSearchOpen
            ? "bg-gradient-to-r from-purple-500 to-red-500 text-white border-white/30 shadow-lg shadow-purple-500/25 scale-105"
            : "bg-white/20 text-white hover:bg-white/30 border-white/30 hover:border-white/50 hover:scale-105 backdrop-blur-sm"
        )}
      >
        <SearchIcon className="h-5 w-5" />
        <span className="text-sm">TÌM KIẾM</span>
        {isSearchOpen && <Sparkles className="h-4 w-4 animate-pulse" />}
      </Button>

      {/* Search Dropdown */}
      {isSearchOpen && (
        <div className="absolute right-0 mt-3 w-[700px] bg-white/95 backdrop-blur-xl shadow-2xl shadow-purple-500/20 rounded-2xl z-50 border border-purple-200/50">
          {/* Search Header */}
          <div className="bg-gradient-to-r from-purple-500 to-red-500 p-4 sticky top-0 z-10 rounded-tl-2xl rounded-tr-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2 shadow-lg">
                <SearchIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm hoặc mã vạch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 text-white placeholder:text-purple-100 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:border-white/50 rounded-lg shadow-md backdrop-blur-sm"
                  aria-label="Nhập từ khóa tìm kiếm hoặc mã vạch"
                />
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="bg-white/95 backdrop-blur-sm overflow-y-auto max-h-[50vh] rounded-b-lg"
          >
            {error && (
              <div className="p-8 text-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-md">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-8 text-center">
                <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="text-purple-600 font-medium">Đang tìm kiếm...</span>
                  </div>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-4">
                <div className="space-y-4">
                  {visibleProducts.map(product => {
                    const { giaTri, giaBan, khuyenMai } = getPriceInfo(product);
                    const firstImage = getFirstImage(product);

                    return (
                      <div
                        key={product.maSanPham}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-200 flex items-center"
                      >
                        {/* Image Section */}
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <Link to={`/products/${product.maSanPham}`} onClick={() => setIsSearchOpen(false)}>
                            <img
                              src={firstImage.url}
                              alt={firstImage.alt}
                              className="w-full h-full object-cover rounded-lg border-2 border-purple-200"
                              loading="lazy"
                              onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                            />
                          </Link>
                          {/* Discount Badge */}
                          {khuyenMai !== null && khuyenMai > 0 && (
                            <div className="absolute top-1 right-1 flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                              <Bolt className="h-3 w-3 mr-1 animate-pulse" />
                              -{khuyenMai}%
                            </div>
                          )}

                          {/* Hashtag Badge */}
                          {product.maHashtag && product.tenHashtag && (
                            <div className="absolute bottom-1 left-1 flex items-center bg-gradient-to-r from-white via-yellow-50 to-orange-50 text-gray-800 font-bold px-2 py-1 rounded-lg shadow-lg border border-yellow-300">
                              <img
                                src={product.hinhAnhHashtag ? `${API_URL}${product.hinhAnhHashtag}` : PLACEHOLDER_HASHTAG_IMAGE}
                                alt={product.tenHashtag}
                                className="h-6 w-6 object-cover rounded-full mr-1 border border-white shadow-sm"
                                onError={(e) => (e.currentTarget.src = PLACEHOLDER_HASHTAG_IMAGE)}
                              />
                              <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                                {product.tenHashtag}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Product Info */}
                        <div className="p-4 flex-1">
                          <Link to={`/products/${product.maSanPham}`} onClick={() => setIsSearchOpen(false)}>
                            <h3 className="text-lg font-medium text-purple-700 hover:text-purple-800 transition-colors line-clamp-2">
                              {product.tenSanPham}
                            </h3>
                          </Link>
                          {/* Price */}
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600">
                              {giaTri > 0 ? `${giaTri.toLocaleString("vi-VN")}₫` : "Liên hệ"}
                            </p>
                            {giaBan > 0 && khuyenMai && khuyenMai > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                {giaBan.toLocaleString("vi-VN")}₫
                              </p>
                            )}
                          </div>
                          {/* Type, Brand, Gender */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <div className="flex items-center bg-gradient-to-r from-blue-100 to-pink-100 px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
                              <span className="text-xs font-medium text-gray-700">
                                {product.gioiTinh === 1 ? "👨 Nam" : product.gioiTinh === 2 ? "👩 Nữ" : "👫 Unisex"}
                              </span>
                            </div>
                            {product.tenThuongHieu && (
                              <div className="flex items-center bg-gradient-to-r from-purple-100 to-indigo-100 px-2.5 py-1 rounded-full shadow-sm border border-purple-200">
                                <span className="text-xs font-medium text-purple-700">
                                  🏷️ {product.tenThuongHieu}
                                </span>
                              </div>
                            )}
                            {product.tenLoai && (
                              <div className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-2.5 py-1 rounded-full shadow-sm border border-green-200">
                                <span className="text-xs font-medium text-green-700">
                                  📦 {product.tenLoai}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : searchQuery ? (
              <div className="p-8 text-center">
                <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-100 to-red-100 rounded-full p-3 shadow-md">
                      <SearchIcon className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      Không tìm thấy kết quả cho "{searchQuery}"
                    </p>
                    <p className="text-sm text-gray-500">
                      Hãy thử tìm kiếm với từ khóa khác
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-200 to-red-200 rounded-full p-3 shadow-lg">
                      <SearchIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-purple-700 font-semibold">
                      Tìm kiếm sản phẩm yêu thích
                    </p>
                    <p className="text-sm text-purple-600">
                      Nhập tên sản phẩm hoặc mã vạch để bắt đầu
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* View All Results */}
          {searchResults.length > 0 && (
            <div className="p-4 border-t border-purple-200/50 bg-gray-50 rounded-b-2xl"
            >
              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => {
                  navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Xem tất cả kết quả cho "{searchQuery}"
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;