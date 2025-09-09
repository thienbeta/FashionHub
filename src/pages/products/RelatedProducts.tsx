import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/pages/ui/button";
import { Loader2, Bolt, Heart, Star, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

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
    videos: string[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150?text=No+Image";
const PLACEHOLDER_HASHTAG_IMAGE = "https://via.placeholder.com/40?text=Tag";
const PRODUCTS_PER_PAGE = 4;

interface RelatedProductsProps {
    maLoai: number;
    maThuongHieu: number;
    currentProductId: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ maLoai, maThuongHieu, currentProductId }) => {
    const [relatedProducts, setRelatedProducts] = useState<SanPham[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [favorites, setFavorites] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    // Fetch related products
    const fetchRelatedProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/SanPham/filter/loai-thuong-hieu?maLoai=${maLoai}&maThuongHieu=${maThuongHieu}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                if (response.status === 400) throw new Error("Yêu cầu không hợp lệ.");
                if (response.status === 500) throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
                throw new Error("Không thể lấy danh sách sản phẩm liên quan.");
            }

            const data: SanPham[] = await response.json();
            const filteredProducts = data.filter(product => product.maSanPham !== currentProductId);
            setRelatedProducts(filteredProducts);
        } catch (error) {
            setError((error as Error).message);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: `Lỗi khi tải sản phẩm liên quan: ${(error as Error).message}`,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            });
        } finally {
            setLoading(false);
        }
    }, [maLoai, maThuongHieu, currentProductId]);

    // Load favorites from localStorage
    const loadFavorites = useCallback(() => {
        const savedFavorites = localStorage.getItem("favoriteProducts");
        const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
        setFavorites(favoriteIds);
    }, []);

    // Toggle favorite status
    const toggleFavorite = (productId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const scrollPosition = window.scrollY;
        const isCurrentlyFavorite = favorites.includes(productId);
        const newFavorites = isCurrentlyFavorite
            ? favorites.filter(id => id !== productId)
            : [productId, ...favorites];

        setFavorites(newFavorites);
        localStorage.setItem("favoriteProducts", JSON.stringify(newFavorites));

        Swal.fire({
            icon: "success",
            title: isCurrentlyFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: () => {
                const swalContainer = document.querySelector(".swal2-container");
                if (swalContainer) {
                    (swalContainer as HTMLElement).style.pointerEvents = "none";
                    (swalContainer as HTMLElement).style.zIndex = "1000";
                }
                window.scrollTo(0, scrollPosition);
            },
            didClose: () => {
                const swalContainer = document.querySelector(".swal2-container");
                if (swalContainer) {
                    (swalContainer as HTMLElement).style.pointerEvents = "auto";
                }
                window.scrollTo(0, scrollPosition);
            },
        });
    };

    // Load more products
    const loadMoreProducts = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setLoadingMore(false);
        }, 500);
    };

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
                    <span className="animate-pulse">{percent.toFixed(1)}% ĐÃ BÁN</span>
                    <span className="animate-bounce">🔥</span>
                </div>
            </div>
        );
    };

    // Initialize favorites and fetch products
    useEffect(() => {
        loadFavorites();
        fetchRelatedProducts();
    }, [fetchRelatedProducts, loadFavorites]);

    const visibleProducts = relatedProducts.slice(0, currentPage * PRODUCTS_PER_PAGE);
    const hasMore = currentPage * PRODUCTS_PER_PAGE < relatedProducts.length;

    if (loading) {
        return (
            <div className="py-8 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-2 text-purple-600">Đang tải sản phẩm liên quan...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8 text-center">
                <h3 className="text-xl font-semibold mb-2 text-red-600">Lỗi khi tải sản phẩm liên quan</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchRelatedProducts} className="bg-purple-600 hover:bg-purple-700">
                    Thử lại
                </Button>
            </div>
        );
    }

    if (relatedProducts.length === 0) {
        return (
            <div className="py-8 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Không có sản phẩm liên quan</h3>
                <p className="text-gray-600">Không tìm thấy sản phẩm phù hợp.</p>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600 mb-8 flex items-center">
                    Sản Phẩm Liên Quan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visibleProducts.map(product => {
                        const { giaTri, giaBan, khuyenMai } = getPriceInfo(product);
                        const firstImage = getFirstImage(product);

                        return (
                            <div
                                key={product.maSanPham}
                                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-200"
                            >
                                {/* Image Section */}
                                <div className="relative aspect-square rounded-t-2xl overflow-hidden">
                                    <Link to={`/products/${product.maSanPham}`}>
                                        <img
                                            src={firstImage.url}
                                            alt={firstImage.alt}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                                        />
                                    </Link>
                                    {/* Favorite Button */}
                                    <button
                                        onClick={(e) => toggleFavorite(product.maSanPham, e)}
                                        className="absolute top-2 left-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                                        aria-label={favorites.includes(product.maSanPham) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                                    >
                                        <Heart
                                            className={`h-5 w-5 transition-colors duration-200 ${favorites.includes(product.maSanPham)
                                                ? "fill-red-500 text-red-500"
                                                : "text-gray-600 hover:text-red-500"
                                                }`}
                                        />
                                    </button>
                                    {/* Discount Badge */}
                                    {khuyenMai !== null && khuyenMai > 0 && (
                                        <div className="absolute top-2 right-2 flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-2.5 py-1.5 rounded-full shadow-md">
                                            <Bolt className="h-4 w-4 mr-1 animate-pulse" />
                                            -{khuyenMai}%
                                        </div>
                                    )}
                                    {/* Hashtag Badge */}
                                    {product.maHashtag && product.tenHashtag && (
                                        <div className="absolute bottom-2 left-2 flex items-center bg-gradient-to-r from-white via-yellow-50 to-orange-50 text-gray-800 font-bold px-3 py-2 rounded-xl shadow-lg border-2 border-yellow-300">
                                            <img
                                                src={product.hinhAnhHashtag ? `${API_URL}${product.hinhAnhHashtag}` : PLACEHOLDER_HASHTAG_IMAGE}
                                                alt={product.tenHashtag}
                                                className="h-8 w-8 object-cover rounded-full mr-2 border-2 border-white shadow-sm"
                                                onError={(e) => (e.currentTarget.src = PLACEHOLDER_HASHTAG_IMAGE)}
                                            />
                                            <span className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                                                {product.tenHashtag}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {/* Product Info */}
                                <div className="p-4">
                                    <Link to={`/products/${product.maSanPham}`}>
                                        <h3 className="text-lg font-medium text-purple-700 hover:text-purple-800 transition-colors line-clamp-2">
                                            {product.tenSanPham}
                                        </h3>
                                    </Link>
                                    {/* Rating */}
                                    {product.danhGiaTrungBinh !== null && (
                                        <div className="flex items-center mt-1">
                                            {renderStars(product.danhGiaTrungBinh)}
                                            <span className="ml-2 text-sm text-gray-600">
                                                ({product.soLuongDanhGia || 0})
                                            </span>
                                        </div>
                                    )}
                                    {/* Price */}
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600">
                                                {giaTri > 0 ? `${giaTri.toLocaleString("vi-VN")}₫` : "Liên hệ"}
                                            </p>
                                            {giaBan > 0 && khuyenMai && khuyenMai > 0 && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    {giaBan.toLocaleString("vi-VN")}₫
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Type, Brand, Gender */}
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
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
                                    {/* Progress Bar */}
                                    {renderProgressBar(product.tongSoLuongBan, product.tongSoLuongNhap)}
                                    {/* View Details Button */}
                                    <Button
                                        className="mt-4 w-full bg-gradient-to-r from-purple-100 to-red-100 text-purple-600 hover:from-purple-200 hover:to-red-200 text-sm py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                                        asChild
                                    >
                                        <Link to={`/products/${product.maSanPham}`}>Xem Chi Tiết</Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Load More Button */}
                {hasMore && !loading && (
                    <div className="flex justify-center mt-12">
                        <Button
                            onClick={loadMoreProducts}
                            disabled={loadingMore}
                            className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 
                 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl 
                 transition-all duration-200 text-lg flex items-center gap-2"
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Đang tải...
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-5 w-5" />
                                    Xem thêm {Math.min(PRODUCTS_PER_PAGE, relatedProducts.length - visibleProducts.length)} sản phẩm
                                </>
                            )}
                        </Button>
                    </div>
                )}
                {/* No More Products Message */}
                {!hasMore && relatedProducts.length > PRODUCTS_PER_PAGE && (
                    <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
                        <p className="text-gray-600">
                            ✨ Bạn đã xem hết {relatedProducts.length} sản phẩm liên quan
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RelatedProducts;