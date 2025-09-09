import { useState, useEffect } from "react";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";

interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
  loaiDanhMuc: number;
  hinhAnh: string | null;
  ngayTao: string;
  trangThai: number;
}

interface FilterState {
  category: number | null;
  brand: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

interface ProductFilterProps {
  categories: DanhMuc[];
  brands: DanhMuc[];
  onFilterChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ categories, brands, onFilterChange, currentFilters }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      category: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bộ Lọc Sản Phẩm</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Danh Mục</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={localFilters.category || ""}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, category: e.target.value ? Number(e.target.value) : null })
          }
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.maDanhMuc} value={category.maDanhMuc}>
              {category.tenDanhMuc}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Thương Hiệu</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={localFilters.brand || ""}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, brand: e.target.value ? Number(e.target.value) : null })
          }
        >
          <option value="">Tất cả thương hiệu</option>
          {brands.map((brand) => (
            <option key={brand.maDanhMuc} value={brand.maDanhMuc}>
              {brand.tenDanhMuc}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Khoảng Giá</h3>
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Giá tối thiểu"
            value={localFilters.minPrice || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, minPrice: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Giá tối đa"
            value={localFilters.maxPrice || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, maxPrice: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full"
          />
        </div>
      </div>

      {/* Apply and Reset Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleFilterChange}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Áp Dụng
        </Button>
        <Button
          onClick={handleResetFilters}
          className="w-full bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Xóa Bộ Lọc
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;