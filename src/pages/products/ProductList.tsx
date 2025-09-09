import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Bolt } from "lucide-react";
import { Button } from "@/pages/ui/button";
import { Card, CardContent } from "@/pages/ui/card";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import ProductFilter from "./ProductFilter";

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
}

interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
  loaiDanhMuc: number;
  hinhAnh: string | null;
  ngayTao: string;
  trangThai: number;
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
  maThuongHieu: number;
  tenThuongHieu: string | null;
  maHashtag: number | null;
  tenHashtag: string | null;
  ngayTao: string;
  trangThai: number;
  medias: Media[];
  videos: string[];
}

interface FilterState {
  category: number | null;
  brand: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150?text=No+Image";
const PLACEHOLDER_HASHTAG_IMAGE = "https://via.placeholder.com/40?text=Tag";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<SanPham[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SanPham[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [variantsMap, setVariantsMap] = useState<{ [key: number]: BienThe[] }>({});
  const [hashtagImages, setHashtagImages] = useState<{ [key: number]: string }>({});
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
  });
  const [categories, setCategories] = useState<DanhMuc[]>([]);
  const [brands, setBrands] = useState<DanhMuc[]>([]);

  // Fetch products, variants, hashtag images, categories, and brands
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch products
      const response = await fetch(`${API_URL}/api/SanPham`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Không tìm thấy dữ liệu sản phẩm.");
        if (response.status === 500) {
          const errorData = await response.json();
          throw new Error(errorData.Message || "Lỗi máy chủ, vui lòng thử lại sau.");
        }
        throw new Error("Không thể lấy danh sách sản phẩm.");
      }

      const data: SanPham[] = await response.json();
      setProducts(data);
      setFilteredProducts(data); // Initially, no filters applied

      // Fetch variants for each product
      const variantsPromises = data.map(product =>
        fetch(`${API_URL}/api/BienThe/by-san-pham/${product.maSanPham}`)
          .then(res => {
            if (!res.ok) throw new Error(`Không thể lấy biến thể cho sản phẩm ${product.maSanPham}`);
            return res.json();
          })
          .then((variants: BienThe[]) => ({ maSanPham: product.maSanPham, variants }))
          .catch(() => ({ maSanPham: product.maSanPham, variants: [] }))
      );

      const variantsResults = await Promise.all(variantsPromises);
      const newVariantsMap: { [key: number]: BienThe[] } = {};
      variantsResults.forEach(({ maSanPham, variants }) => {
        newVariantsMap[maSanPham] = variants;
      });
      setVariantsMap(newVariantsMap);

      // Fetch hashtag images
      const hashtagImagePromises = data
        .filter(product => product.maHashtag !== null)
        .map(product =>
          fetch(`${API_URL}/api/DanhMuc/${product.maHashtag}`)
            .then(res => {
              if (!res.ok) throw new Error(`Không thể lấy danh mục hashtag ${product.maHashtag}`);
              return res.json();
            })
            .then((danhMuc: DanhMuc) => ({
              maHashtag: product.maHashtag!,
              image: danhMuc.hinhAnh ? `${API_URL}${danhMuc.hinhAnh}` : PLACEHOLDER_HASHTAG_IMAGE,
            }))
            .catch(() => ({ maHashtag: product.maHashtag!, image: PLACEHOLDER_HASHTAG_IMAGE }))
        );

      const hashtagImageResults = await Promise.all(hashtagImagePromises);
      const newHashtagImages: { [key: number]: string } = {};
      hashtagImageResults.forEach(({ maHashtag, image }) => {
        newHashtagImages[maHashtag] = image;
      });
      setHashtagImages(newHashtagImages);

      // Fetch categories
      const categoriesResponse = await fetch(`${API_URL}/api/DanhMuc?loaiDanhMuc=1`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!categoriesResponse.ok) throw new Error("Không thể lấy danh sách danh mục.");
      const categoriesData: DanhMuc[] = await categoriesResponse.json();
      setCategories(categoriesData);

      // Fetch brands
      const brandsResponse = await fetch(`${API_URL}/api/DanhMuc?loaiDanhMuc=2`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!brandsResponse.ok) throw new Error("Không thể lấy danh sách thương hiệu.");
      const brandsData: DanhMuc[] = await brandsResponse.json();
      setBrands(brandsData);
    } catch (error) {
      setError((error as Error).message);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi tải danh sách sản phẩm: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters to products
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(product => product.maLoai === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.maThuongHieu === filters.brand);
    }

    if (filters.minPrice !== null || filters.maxPrice !== null) {
      filtered = filtered.filter(product => {
        const { giaTri } = getPriceInfo(product.maSanPham);
        if (filters.minPrice !== null && giaTri < filters.minPrice) return false;
        if (filters.maxPrice !== null && giaTri > filters.maxPrice) return false;
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  // Get the lowest final price (giaTri) and corresponding original price (giaBan) and discount (khuyenMai)
  const getPriceInfo = (maSanPham: number): { giaTri: number; giaBan: number; khuyenMai: number | null } => {
    const variants = variantsMap[maSanPham] || [];
    if (variants.length === 0) {
      return { giaTri: 0, giaBan: 0, khuyenMai: null };
    }
    const lowestVariant = variants.reduce((min, variant) =>
      variant.giaTri < min.giaTri ? variant : min,
      variants[0]
    );
    return {
      giaTri: lowestVariant.giaTri,
      giaBan: lowestVariant.giaBan,
      khuyenMai: lowestVariant.khuyenMai,
    };
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <ProductFilter
            categories={categories}
            brands={brands}
            onFilterChange={setFilters}
            currentFilters={filters}
          />
        </div>
        <div className="md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Lỗi khi tải sản phẩm</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-600 mb-4">Vui lòng thử lại với các bộ lọc khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const firstImage = product.medias.find(media => media.loaiMedia === "image" && media.trangThai === 1);
                const { giaTri, giaBan, khuyenMai } = getPriceInfo(product.maSanPham);
                const hashtagImage = product.maHashtag ? hashtagImages[product.maHashtag] : null;
                return (
                  <Card key={product.maSanPham} className="overflow-hidden group">
                    <div className="relative aspect-square">
                      <Link to={`/products/${product.maSanPham}`}>
                        <img
                          src={firstImage ? `${API_URL}${firstImage.duongDan}` : PLACEHOLDER_IMAGE}
                          alt={firstImage?.altMedia || product.tenSanPham}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                        />
                      </Link>
                      {khuyenMai !== null && (
                        <div className="absolute top-2 right-2 flex items-center bg-red-500 text-white text-sm font-bold px-2.5 py-1.5 rounded-full">
                          <Bolt className="h-5 w-5 mr-1" />
                          -{khuyenMai}%
                        </div>
                      )}
                      {product.maHashtag && product.tenHashtag && (
                        <div className="absolute bottom-2 left-2 flex items-center bg-white/80 text-gray-800 text-sm font-medium px-2.5 py-1.5 rounded-full">
                          {hashtagImage && (
                            <img
                              src={hashtagImage}
                              alt={product.tenHashtag}
                              className="h-6 w-6 object-cover rounded-full mr-1.5"
                              onError={(e) => (e.currentTarget.src = PLACEHOLDER_HASHTAG_IMAGE)}
                            />
                          )}
                          <span>{product.tenHashtag}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <Link to={`/products/${product.maSanPham}`}>
                        <h3 className="text-xl font-medium hover:text-indigo-600 transition-colors">
                          {product.tenSanPham}
                        </h3>
                      </Link>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold">
                            {giaTri > 0
                              ? `${giaTri.toLocaleString("vi-VN")}₫`
                              : "Liên hệ"}
                          </p>
                          {giaBan > 0 && (
                            <p className="text-base text-gray-500 line-through">
                              {giaBan.toLocaleString("vi-VN")}₫
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        className="mt-4 w-full bg-[#e7e4f5] text-[#9b87f5] hover:bg-[#d5d0f0] text-lg py-2"
                        asChild
                      >
                        <Link to={`/products/${product.maSanPham}`}>
                          <ShoppingCart className="mr-2 h-5 w-5" /> Xem Chi Tiết
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;