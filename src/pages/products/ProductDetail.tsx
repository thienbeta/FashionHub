import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/pages/ui/button";
import { Loader2, Bolt, ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import Swal from "sweetalert2";
import Cmt from "./Cmt";
import RelatedProducts from "./RelatedProducts";

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
  videos: string[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150?text=No+Image";
const PLACEHOLDER_HASHTAG_IMAGE = "https://via.placeholder.com/40?text=Tag";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<SanPham | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Fetch product details
  const fetchProductData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/SanPham/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Không tìm thấy sản phẩm.");
        throw new Error("Không thể lấy thông tin sản phẩm.");
      }

      const productData: SanPham = await response.json();
      setProduct(productData);

      // Set initial color and size
      const colors = [...new Set(productData.bienThes.map(v => v.tenMau).filter((m): m is string => m !== null))];
      const sizes = [...new Set(productData.bienThes.map(v => v.tenKichThuoc).filter((s): s is string => s !== null))];
      setSelectedColor(colors[0] || null);
      setSelectedSize(sizes[0] || null);
    } catch (error) {
      setError((error as Error).message);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi tải thông tin sản phẩm: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load favorites from localStorage
  const loadFavorites = useCallback(() => {
    const savedFavorites = localStorage.getItem('favoriteProducts');
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
    setFavorites(favoriteIds);
  }, []);

  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;

    const scrollPosition = window.scrollY;
    const productId = product.maSanPham;
    const isCurrentlyFavorite = favorites.includes(productId);
    let newFavorites: number[];

    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter(id => id !== productId);
    } else {
      newFavorites = [productId, ...favorites];
    }

    setFavorites(newFavorites);
    localStorage.setItem('favoriteProducts', JSON.stringify(newFavorites));

    Swal.fire({
      icon: 'success',
      title: isCurrentlyFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
          (swalContainer as HTMLElement).style.pointerEvents = 'none';
          (swalContainer as HTMLElement).style.zIndex = '1000';
        }
        window.scrollTo(0, scrollPosition);
      },
      didClose: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
          (swalContainer as HTMLElement).style.pointerEvents = 'auto';
        }
        window.scrollTo(0, scrollPosition);
      }
    });
  };

  // Get price and stock info for selected variant
  const getVariantInfo = (): { giaTri: number; giaBan: number; khuyenMai: number | null; stock: number } => {
    if (!selectedColor || !selectedSize || !product?.bienThes) {
      return { giaTri: 0, giaBan: 0, khuyenMai: null, stock: 0 };
    }
    const selectedVariant = product.bienThes.find(
      v => v.tenMau === selectedColor && v.tenKichThuoc === selectedSize && v.trangThai === 1
    );
    if (!selectedVariant) {
      return { giaTri: 0, giaBan: 0, khuyenMai: null, stock: 0 };
    }
    return {
      giaTri: selectedVariant.giaTri,
      giaBan: selectedVariant.giaBan,
      khuyenMai: selectedVariant.khuyenMai,
      stock: selectedVariant.soLuongNhap - selectedVariant.soLuongBan,
    };
  };

  // Get all images (variant images + medias)
  const getAllImages = (): { url: string; alt: string }[] => {
    if (!product) return [];
    const variantImages = product.bienThes
      .filter(v => v.hinhAnh && v.trangThai === 1)
      .map(v => ({
        url: `${API_URL}${v.hinhAnh}`,
        alt: `${product.tenSanPham} - ${v.tenMau}`,
      }));
    const mediaImages = product.medias
      .filter(media => media.loaiMedia === "image" && media.trangThai === 1)
      .map(media => ({
        url: `${API_URL}${media.duongDan}`,
        alt: media.altMedia || `${product.tenSanPham} - Góc nhìn ${media.maMedia}`,
      }));
    const allImages = [...variantImages, ...mediaImages];
    return Array.from(new Map(allImages.map(img => [img.url, img])).values());
  };

  // Get image for selected color
  const getColorImage = (color: string): string => {
    if (!product) return PLACEHOLDER_IMAGE;
    const variant = product.bienThes.find(v => v.tenMau === color && v.hinhAnh && v.trangThai === 1);
    return variant ? `${API_URL}${variant.hinhAnh}` : product.medias[0]?.duongDan ? `${API_URL}${product.medias[0].duongDan}` : PLACEHOLDER_IMAGE;
  };

  // Auto-slide images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMainImageIndex(prev => (prev + 1) % getAllImages().length);
    }, 5000);
    return () => clearInterval(interval);
  }, [product]);

  // Load favorites and fetch product data on mount
  useEffect(() => {
    loadFavorites();
    fetchProductData();
  }, [fetchProductData, loadFavorites]);

  // Render star rating
  const renderStars = (rating: number | null, count: number) => {
    const stars = Math.round(rating || 0);
    return (
      <div className="flex items-center space-x-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < stars ? "fill-yellow-400 stroke-yellow-400" : "fill-none stroke-gray-300"}`}
            />
          ))}
        </div>
        <span className="text-gray-600">({rating?.toFixed(1) || 0} - {count} đánh giá)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-red-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-purple-100">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600" />
            <p className="text-purple-700 font-medium">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-red-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 text-center">
          <h3 className="text-2xl font-bold mb-4 text-red-600">Lỗi khi tải sản phẩm</h3>
          <p className="text-gray-600 text-lg">{error || "Sản phẩm không tồn tại."}</p>
        </div>
      </div>
    );
  }

  const { giaTri, giaBan, khuyenMai, stock } = getVariantInfo();
  const colors = [...new Set(product.bienThes.map(v => v.tenMau).filter((m): m is string => m !== null))];
  const sizes = [...new Set(product.bienThes.map(v => v.tenKichThuoc).filter((s): s is string => s !== null))];
  const allImages = getAllImages();
  const hashtagImage = product.hinhAnhHashtag ? `${API_URL}${product.hinhAnhHashtag}` : PLACEHOLDER_HASHTAG_IMAGE;

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-red-100 shadow-2xl border border-purple-200/50 group">
              <img
                src={allImages[mainImageIndex]?.url || PLACEHOLDER_IMAGE}
                alt={allImages[mainImageIndex]?.alt || product.tenSanPham}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
              />
              
              {/* Discount Badge */}
              {khuyenMai !== null && khuyenMai > 0 && (
                <div className="absolute top-4 right-4 flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl backdrop-blur-sm">
                  <Bolt className="h-5 w-5 mr-1 animate-pulse" />
                  -{khuyenMai}%
                </div>
              )}
              
              {/* Hashtag Badge */}
              {product.maHashtag && product.tenHashtag && (
                <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm text-gray-800 font-bold px-4 py-3 rounded-xl shadow-lg border-2 border-yellow-300">
                  <img
                    src={hashtagImage}
                    alt={product.tenHashtag}
                    className="h-10 w-10 object-cover rounded-full mr-3 border-2 border-white shadow-sm"
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_HASHTAG_IMAGE)}
                  />
                  <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                    {product.tenHashtag}
                  </span>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <button
                onClick={() => setMainImageIndex(prev => (prev - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white shadow-xl transition-all duration-200 hover:scale-110 border border-purple-200"
              >
                <ChevronLeft className="h-6 w-6 text-purple-600" />
              </button>
              <button
                onClick={() => setMainImageIndex(prev => (prev + 1) % allImages.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white shadow-xl transition-all duration-200 hover:scale-110 border border-purple-200"
              >
                <ChevronRight className="h-6 w-6 text-purple-600" />
              </button>

              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all duration-200 hover:scale-110 border border-purple-200"
                aria-label={favorites.includes(product.maSanPham) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
              >
                <Heart
                  className={`h-6 w-6 transition-colors duration-200 ${
                    favorites.includes(product.maSanPham) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
            
            {/* Thumbnail Slider */}
            <div className="relative overflow-hidden">
              <div className="flex gap-4 pb-2 overflow-x-auto scrollbar-hide">
                {allImages.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      mainImageIndex === idx 
                        ? "border-purple-500 shadow-lg scale-105" 
                        : "border-purple-200 opacity-70 hover:opacity-100 hover:border-purple-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-red-600 leading-tight mb-4">
                {product.tenSanPham}
              </h1>
              
              {/* Rating */}
              <div className="mb-4">
                {renderStars(product.danhGiaTrungBinh, product.soLuongDanhGia)}
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600">
                  {giaTri > 0 ? `${giaTri.toLocaleString("vi-VN")}₫` : "Liên hệ"}
                </p>
                {giaBan > 0 && khuyenMai && khuyenMai > 0 && (
                  <p className="text-xl text-gray-400 line-through">
                    {giaBan.toLocaleString("vi-VN")}₫
                  </p>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <span className="font-medium text-purple-700">Loại sản phẩm:</span>
                  <p className="text-gray-700 mt-1">{product.tenLoai || "N/A"}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <span className="font-medium text-purple-700">Thương hiệu:</span>
                  <p className="text-gray-700 mt-1">{product.tenThuongHieu || "N/A"}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <span className="font-medium text-purple-700">Giới tính:</span>
                  <p className="text-gray-700 mt-1">
                    {product.gioiTinh === 1 ? "Nam" : product.gioiTinh === 2 ? "Nữ" : "Unisex"}
                  </p>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200">
              <h3 className="font-bold text-xl mb-4 text-purple-700 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Màu sắc
              </h3>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setMainImageIndex(allImages.findIndex(img => img.url === getColorImage(color)) || 0);
                    }}
                    className={`flex items-center px-4 py-2 rounded-xl border-2 text-base font-medium transition-all duration-200 ${
                      selectedColor === color
                        ? "border-purple-500 bg-gradient-to-r from-purple-100 to-red-100 text-purple-700 shadow-lg scale-105"
                        : "border-purple-200 hover:border-purple-300 bg-white hover:bg-purple-50 hover:scale-102"
                    }`}
                  >
                    <img
                      src={getColorImage(color)}
                      alt={color}
                      className="h-6 w-6 object-cover rounded-full mr-2"
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200">
              <h3 className="font-bold text-xl mb-4 text-purple-700 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Kích cỡ
              </h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 text-base font-bold transition-all duration-200 ${
                      selectedSize === size
                        ? "border-red-500 bg-gradient-to-br from-red-100 to-purple-100 text-red-700 shadow-lg scale-105"
                        : "border-purple-200 hover:border-red-300 bg-white hover:bg-red-50 hover:scale-105"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-medium text-gray-700">
                  Số lượng trong kho: 
                  <span className={`ml-2 font-bold ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {stock > 0 ? stock : "Hết hàng"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-200">
          <h3 className="font-bold text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-red-600 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-red-500 rounded-full mr-4"></div>
            Mô tả sản phẩm
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed bg-gradient-to-r from-purple-50 to-red-50 p-6 rounded-xl border border-purple-100">
              {product.moTa || "Không có mô tả sản phẩm."}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <Cmt productId={product.maSanPham} />
        </div>

        {/* Related Products Section */}
        <RelatedProducts
          maLoai={product.maLoai}
          maThuongHieu={product.maThuongHieu}
          currentProductId={product.maSanPham}
        />
      </div>
    </div>
  );
};

export default ProductDetail;