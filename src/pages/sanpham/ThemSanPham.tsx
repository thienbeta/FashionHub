import { useState, useEffect } from "react";
import { Input } from "@/pages/ui/input";
import { Button } from "@/pages/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/pages/ui/dialog";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
  loaiDanhMuc: number;
  trangThai: number;
}

interface SizeForm {
  giaNhap: string;
  giaBan: string;
  soLuong: string;
  maKichThuoc: string;
  maVach: string;
  khuyenMai: string;
  giaTri: string;
  showKhuyenMai: boolean;
}

interface VariantForm {
  hinhAnhMoi: File | null;
  hinhAnhPreview: string;
  maMauMoi: string;
  sizeForms: SizeForm[];
  errorsThem: {
    hinhAnh: string;
    mau: string;
    sizes: { giaNhap: string; giaBan: string; soLuong: string; kichThuoc: string; maVach: string; khuyenMai: string; giaTri: string }[];
  };
}

interface ThemSanPhamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  danhMucList: DanhMuc[];
  fetchSanPham: () => Promise<void>;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  mauList: DanhMuc[];
  kichThuocList: DanhMuc[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";

const ThemSanPham: React.FC<ThemSanPhamProps> = ({
  open,
  onOpenChange,
  danhMucList,
  fetchSanPham,
  isProcessing,
  setIsProcessing,
  mauList,
  kichThuocList,
}) => {
  // Product state
  const [tenSanPhamMoi, setTenSanPhamMoi] = useState("");
  const [maLoaiMoi, setMaLoaiMoi] = useState("");
  const [maThuongHieuMoi, setMaThuongHieuMoi] = useState("");
  const [maHashtagMoi, setMaHashtagMoi] = useState("");
  const [gioiTinhMoi, setGioiTinhMoi] = useState("0");
  const [chatLieuMoi, setChatLieuMoi] = useState("");
  const [moTaMoi, setMoTaMoi] = useState("");
  const [imagesMoi, setImagesMoi] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [isDraggingImages, setIsDraggingImages] = useState(false);

  // Variant state
  const [variants, setVariants] = useState<VariantForm[]>([
    {
      hinhAnhMoi: null,
      hinhAnhPreview: "",
      maMauMoi: "",
      sizeForms: [{
        giaNhap: "",
        giaBan: "",
        soLuong: "",
        maKichThuoc: "",
        maVach: "",
        khuyenMai: "",
        giaTri: "",
        showKhuyenMai: false,
      }],
      errorsThem: {
        hinhAnh: "",
        mau: "",
        sizes: [{
          giaNhap: "",
          giaBan: "",
          soLuong: "",
          kichThuoc: "",
          maVach: "",
          khuyenMai: "",
          giaTri: "",
        }],
      },
    },
  ]);
  const [isDragging, setIsDragging] = useState<number | null>(null);

  // Product errors
  const [errorsThem, setErrorsThem] = useState({
    ten: "",
    maLoai: "",
    maThuongHieu: "",
    maHashtag: "",
    gioiTinh: "",
    chatLieu: "",
    moTa: "",
    images: "",
  });

  // Calculate giaTri whenever giaBan or khuyenMai changes
  useEffect(() => {
    setVariants((prevVariants) =>
      prevVariants.map((variant, formIndex) => ({
        ...variant,
        sizeForms: variant.sizeForms.map((size, sizeIndex) => {
          if (size.showKhuyenMai && size.giaBan && size.khuyenMai) {
            const giaBanNum = parseFloat(size.giaBan);
            const khuyenMaiNum = parseFloat(size.khuyenMai);
            if (!isNaN(giaBanNum) && !isNaN(khuyenMaiNum)) {
              const giaTri = giaBanNum - (giaBanNum * khuyenMaiNum) / 100;
              return { ...size, giaTri: giaTri.toFixed(2) };
            }
          }
          return size;
        }),
      }))
    );
  }, [variants]);

  // Handle product image uploads
  const handleFiles = (
    files: File[],
    setFiles: (files: File[]) => void,
    setPreviews: (previews: string[]) => void
  ) => {
    const validFiles: File[] = [];
    const validPreviews: string[] = [];
    let hasError = false;

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Vui lòng chọn tệp hình ảnh!",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          showCloseButton: true,
        });
        hasError = true;
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Kích thước hình ảnh không được vượt quá 5MB!",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          showCloseButton: true,
        });
        hasError = true;
        continue;
      }
      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push(reader.result as string);
        setPreviews([...validPreviews]);
      };
      reader.readAsDataURL(file);
    }

    setFiles(validFiles);
    if (!hasError) setErrorsThem((prev) => ({ ...prev, images: "" }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDraggingImages(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDraggingImages(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDraggingImages(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFiles(files, setImagesMoi, setImagesPreview);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) handleFiles(files, setImagesMoi, setImagesPreview);
  };

  const removeFile = (index: number) => {
    setImagesMoi((prev) => prev.filter((_, i) => i !== index));
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle variant image uploads
  const handleVariantFile = (file: File, formIndex: number) => {
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn một tệp hình ảnh!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Kích thước hình ảnh không được vượt quá 5MB!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    const newVariants = [...variants];
    newVariants[formIndex].hinhAnhMoi = file;
    const reader = new FileReader();
    reader.onloadend = () => {
      newVariants[formIndex].hinhAnhPreview = reader.result as string;
      setVariants(newVariants);
    };
    reader.readAsDataURL(file);
    newVariants[formIndex].errorsThem.hinhAnh = "";
    setVariants(newVariants);
  };

  const handleVariantDragOver = (
    e: React.DragEvent<HTMLElement>,
    formIndex: number
  ) => {
    e.preventDefault();
    setIsDragging(formIndex);
  };

  const handleVariantDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(null);
  };

  const handleVariantDrop = (
    e: React.DragEvent<HTMLElement>,
    formIndex: number
  ) => {
    e.preventDefault();
    setIsDragging(null);
    const file = e.dataTransfer.files[0];
    if (file) handleVariantFile(file, formIndex);
  };

  const handleVariantFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (file) handleVariantFile(file, formIndex);
  };

  const clearVariantImage = (formIndex: number) => {
    const newVariants = [...variants];
    newVariants[formIndex].hinhAnhMoi = null;
    newVariants[formIndex].hinhAnhPreview = "";
    setVariants(newVariants);
  };

  // Manage size forms
  const addSizeForm = (formIndex: number) => {
    const newVariants = [...variants];
    newVariants[formIndex].sizeForms.push({
      giaNhap: "",
      giaBan: "",
      soLuong: "",
      maKichThuoc: "",
      maVach: "",
      khuyenMai: "",
      giaTri: "",
      showKhuyenMai: false,
    });
    newVariants[formIndex].errorsThem.sizes.push({
      giaNhap: "",
      giaBan: "",
      soLuong: "",
      kichThuoc: "",
      maVach: "",
      khuyenMai: "",
      giaTri: "",
    });
    setVariants(newVariants);
  };

  const removeSizeForm = (formIndex: number, sizeIndex: number) => {
    const newVariants = [...variants];
    if (newVariants[formIndex].sizeForms.length > 1) {
      newVariants[formIndex].sizeForms.splice(sizeIndex, 1);
      newVariants[formIndex].errorsThem.sizes.splice(sizeIndex, 1);
      setVariants(newVariants);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Phải có ít nhất một kích thước!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  };

  const toggleKhuyenMai = (formIndex: number, sizeIndex: number) => {
    const newVariants = [...variants];
    newVariants[formIndex].sizeForms[sizeIndex].showKhuyenMai = !newVariants[formIndex].sizeForms[sizeIndex].showKhuyenMai;
    newVariants[formIndex].sizeForms[sizeIndex].khuyenMai = "";
    newVariants[formIndex].sizeForms[sizeIndex].giaTri = "";
    newVariants[formIndex].errorsThem.sizes[sizeIndex].khuyenMai = "";
    newVariants[formIndex].errorsThem.sizes[sizeIndex].giaTri = "";
    setVariants(newVariants);
  };

  const updateSizeForm = (
    formIndex: number,
    sizeIndex: number,
    field: keyof SizeForm,
    value: string
  ) => {
    const newVariants = [...variants];
    newVariants[formIndex].sizeForms[sizeIndex] = {
      ...newVariants[formIndex].sizeForms[sizeIndex],
      [field]: value,
    };
    newVariants[formIndex].errorsThem.sizes[sizeIndex] = {
      ...newVariants[formIndex].errorsThem.sizes[sizeIndex],
      [field]: "",
    };
    setVariants(newVariants);
  };

  // Manage variant forms
  const addNewVariantForm = () => {
    setVariants([
      ...variants,
      {
        hinhAnhMoi: null,
        hinhAnhPreview: "",
        maMauMoi: "",
        sizeForms: [{
          giaNhap: "",
          giaBan: "",
          soLuong: "",
          maKichThuoc: "",
          maVach: "",
          khuyenMai: "",
          giaTri: "",
          showKhuyenMai: false,
        }],
        errorsThem: {
          hinhAnh: "",
          mau: "",
          sizes: [{
            giaNhap: "",
            giaBan: "",
            soLuong: "",
            kichThuoc: "",
            maVach: "",
            khuyenMai: "",
            giaTri: "",
          }],
        },
      },
    ]);
  };

  const removeVariantForm = (formIndex: number) => {
    if (variants.length === 1) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Phải có ít nhất một biến thể!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    const newVariants = variants.filter((_, index) => index !== formIndex);
    setVariants(newVariants);
  };

  // Validate product and variants
  const validateThem = () => {
    let valid = true;
    const newErrors = {
      ten: "",
      maLoai: "",
      maThuongHieu: "",
      maHashtag: "",
      gioiTinh: "",
      chatLieu: "",
      moTa: "",
      images: "",
    };

    // Validate product
    if (!tenSanPhamMoi.trim()) {
      newErrors.ten = "Tên sản phẩm không được để trống!";
      valid = false;
    } else if (tenSanPhamMoi.length > 200) {
      newErrors.ten = "Tên sản phẩm không được dài quá 200 ký tự!";
      valid = false;
    }
    if (!maLoaiMoi) {
      newErrors.maLoai = "Loại sản phẩm không được để trống!";
      valid = false;
    }
    if (!maThuongHieuMoi) {
      newErrors.maThuongHieu = "Thương hiệu không được để trống!";
      valid = false;
    }
    if (moTaMoi.length > 10000) {
      newErrors.moTa = "Mô tả không được dài quá 10,000 ký tự!";
      valid = false;
    }
    if (!chatLieuMoi.trim()) {
      newErrors.chatLieu = "Chất liệu không được để trống!";
      valid = false;
    } else if (chatLieuMoi.length > 100) {
      newErrors.chatLieu = "Chất liệu không được dài quá 100 ký tự!";
      valid = false;
    }
    if (!gioiTinhMoi) {
      newErrors.gioiTinh = "Giới tính không được để trống!";
      valid = false;
    }
    if (imagesMoi.length === 0) {
      newErrors.images = "Vui lòng chọn ít nhất một hình ảnh!";
      valid = false;
    }

    setErrorsThem(newErrors);

    // Validate variants
    const newVariantErrors = variants.map((variant) => {
      const errors = {
        hinhAnh: "",
        mau: "",
        sizes: variant.sizeForms.map(() => ({
          giaNhap: "",
          giaBan: "",
          soLuong: "",
          kichThuoc: "",
          maVach: "",
          khuyenMai: "",
          giaTri: "",
        })),
      };

      if (!variant.hinhAnhMoi) {
        errors.hinhAnh = "Hình ảnh không được để trống!";
        valid = false;
      }
      if (!variant.maMauMoi.trim() || isNaN(parseInt(variant.maMauMoi))) {
        errors.mau = "Vui lòng chọn màu sắc!";
        valid = false;
      }
      variant.sizeForms.forEach((size, index) => {
        if (
          !size.giaNhap.trim() ||
          isNaN(parseFloat(size.giaNhap)) ||
          parseFloat(size.giaNhap) <= 0
        ) {
          errors.sizes[index].giaNhap = "Giá nhập phải là số dương!";
          valid = false;
        }
        if (
          !size.giaBan.trim() ||
          isNaN(parseFloat(size.giaBan)) ||
          parseFloat(size.giaBan) <= 0
        ) {
          errors.sizes[index].giaBan = "Giá bán phải là số dương!";
          valid = false;
        }
        if (
          !size.soLuong.trim() ||
          isNaN(parseInt(size.soLuong)) ||
          parseInt(size.soLuong) <= 0
        ) {
          errors.sizes[index].soLuong = "Số lượng phải là số nguyên dương!";
          valid = false;
        }
        if (!size.maKichThuoc.trim() || isNaN(parseInt(size.maKichThuoc))) {
          errors.sizes[index].kichThuoc = "Vui lòng chọn kích thước!";
          valid = false;
        }
        if (size.maVach && !/^[0-9]{0,13}$/.test(size.maVach)) {
          errors.sizes[index].maVach = "Mã vạch chỉ được chứa số và tối đa 13 ký tự!";
          valid = false;
        }
        if (size.showKhuyenMai) {
          const khuyenMaiNum = parseFloat(size.khuyenMai);
          if (
            !size.khuyenMai.trim() ||
            isNaN(khuyenMaiNum) ||
            khuyenMaiNum < 0 ||
            khuyenMaiNum > 100
          ) {
            errors.sizes[index].khuyenMai = "Khuyến mãi phải là số từ 0 đến 100!";
            valid = false;
          }
        }
      });

      return errors;
    });

    const newVariants = variants.map((variant, index) => ({
      ...variant,
      errorsThem: newVariantErrors[index],
    }));
    setVariants(newVariants);

    return valid;
  };

  // Add product and variants
  const themSanPham = async () => {
    if (!validateThem()) return;

    setIsProcessing(true);
    try {
      // Create product
      const formData = new FormData();
      formData.append("TenSanPham", tenSanPhamMoi.trim());
      formData.append("MaLoai", maLoaiMoi);
      formData.append("MaThuongHieu", maThuongHieuMoi);
      if (maHashtagMoi) formData.append("MaHashtag", maHashtagMoi);
      formData.append("GioiTinh", gioiTinhMoi);
      formData.append("ChatLieu", chatLieuMoi.trim());
      formData.append("MoTa", moTaMoi.trim());
      formData.append("TrangThai", "1");
      imagesMoi.forEach((image) => formData.append("Images", image));

      const response = await fetch(`${API_URL}/api/SanPham`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Không thể thêm sản phẩm.");
      }

      const newSanPham = await response.json();
      const maSanPham = newSanPham.maSanPham;

      // Create variants
      for (const variant of variants) {
        for (const size of variant.sizeForms) {
          const variantFormData = new FormData();
          variantFormData.append("GiaBan", size.giaBan);
          variantFormData.append("GiaNhap", size.giaNhap);
          variantFormData.append("SoLuongNhap", size.soLuong);
          variantFormData.append("SoLuongBan", "0");
          variantFormData.append("MaSanPham", maSanPham.toString());
          variantFormData.append("MaMau", variant.maMauMoi);
          variantFormData.append("MaKichThuoc", size.maKichThuoc);
          variantFormData.append("MaVach", size.maVach || "");
          if (size.showKhuyenMai && size.khuyenMai) {
            variantFormData.append("KhuyenMai", size.khuyenMai);
          }
          variantFormData.append("TrangThai", "1");
          if (variant.hinhAnhMoi)
            variantFormData.append("imageFile", variant.hinhAnhMoi);

          const variantResponse = await fetch(`${API_URL}/api/BienThe`, {
            method: "POST",
            body: variantFormData,
          });

          if (!variantResponse.ok) {
            const errorData = await variantResponse.json();
            throw new Error(errorData.Message || "Không thể thêm biến thể.");
          }
        }
      }

      // Reset form
      setTenSanPhamMoi("");
      setMaLoaiMoi("");
      setMaThuongHieuMoi("");
      setMaHashtagMoi("");
      setGioiTinhMoi("0");
      setChatLieuMoi("");
      setMoTaMoi("");
      setImagesMoi([]);
      setImagesPreview([]);
      setErrorsThem({
        ten: "",
        maLoai: "",
        maThuongHieu: "",
        maHashtag: "",
        gioiTinh: "",
        chatLieu: "",
        moTa: "",
        images: "",
      });
      setVariants([
        {
          hinhAnhMoi: null,
          hinhAnhPreview: "",
          maMauMoi: "",
          sizeForms: [{
            giaNhap: "",
            giaBan: "",
            soLuong: "",
            maKichThuoc: "",
            maVach: "",
            khuyenMai: "",
            giaTri: "",
            showKhuyenMai: false,
          }],
          errorsThem: {
            hinhAnh: "",
            mau: "",
            sizes: [{
              giaNhap: "",
              giaBan: "",
              soLuong: "",
              kichThuoc: "",
              maVach: "",
              khuyenMai: "",
              giaTri: "",
            }],
          },
        },
      ]);
      await fetchSanPham();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm sản phẩm và biến thể thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
      onOpenChange(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi thêm: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl bg-white rounded-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-gray-800">
            Thêm Sản Phẩm
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {/* Tên Sản Phẩm */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Tên Sản Phẩm
            </label>
            <Input
              value={tenSanPhamMoi}
              onChange={(e) => {
                setTenSanPhamMoi(e.target.value);
                setErrorsThem((prev) => ({ ...prev, ten: "" }));
              }}
              placeholder="Tên sản phẩm"
              maxLength={200}
              className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              disabled={isProcessing}
            />
            {errorsThem.ten && (
              <p className="text-red-500 text-sm mt-1">{errorsThem.ten}</p>
            )}
          </div>

          {/* Loại Sản Phẩm và Thương Hiệu */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Loại Sản Phẩm
            </label>
            <select
              value={maLoaiMoi}
              onChange={(e) => {
                setMaLoaiMoi(e.target.value);
                setErrorsThem((prev) => ({ ...prev, maLoai: "" }));
              }}
              className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
              disabled={isProcessing}
            >
              <option value="">Chọn loại sản phẩm</option>
              {danhMucList
                .filter((dm) => dm.loaiDanhMuc === 1)
                .map((dm) => (
                  <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                    {dm.tenDanhMuc}
                  </option>
                ))}
            </select>
            {errorsThem.maLoai && (
              <p className="text-red-500 text-sm mt-1">{errorsThem.maLoai}</p>
            )}
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Thương Hiệu
            </label>
            <select
              value={maThuongHieuMoi}
              onChange={(e) => {
                setMaThuongHieuMoi(e.target.value);
                setErrorsThem((prev) => ({ ...prev, maThuongHieu: "" }));
              }}
              className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
              disabled={isProcessing}
            >
              <option value="">Chọn thương hiệu</option>
              {danhMucList
                .filter((dm) => dm.loaiDanhMuc === 2)
                .map((dm) => (
                  <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                    {dm.tenDanhMuc}
                  </option>
                ))}
            </select>
            {errorsThem.maThuongHieu && (
              <p className="text-red-500 text-sm mt-1">{errorsThem.maThuongHieu}</p>
            )}
          </div>

          {/* Hashtag và Giới Tính */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Hashtag
            </label>
            <select
              value={maHashtagMoi}
              onChange={(e) => {
                setMaHashtagMoi(e.target.value);
                setErrorsThem((prev) => ({ ...prev, maHashtag: "" }));
              }}
              className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
              disabled={isProcessing}
            >
              <option value="">Chọn hashtag (tùy chọn)</option>
              {danhMucList
                .filter((dm) => dm.loaiDanhMuc === 3)
                .map((dm) => (
                  <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                    {dm.tenDanhMuc}
                  </option>
                ))}
            </select>
            {errorsThem.maHashtag && (
              <p className="text-red-500 text-sm mt-1">{errorsThem.maHashtag}</p>
            )}
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Giới Tính
            </label>
            <select
              value={gioiTinhMoi}
              onChange={(e) => {
                setGioiTinhMoi(e.target.value);
                setErrorsThem((prev) => ({ ...prev, gioiTinh: "" }));
              }}
              className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
              disabled={isProcessing}
            >
              <option value="0">Mặc định</option>
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
              <option value="3">Khác</option>
            </select>
            {errorsThem.gioiTinh && (
              <p className="text-red-500 text-sm mt-1">{errorsThem.gioiTinh}</p>
            )}
          </div>

          {/* Chất Liệu */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Chất Liệu
            </label>
            <Input
              value={chatLieuMoi}
              onChange={(e) => {
                setChatLieuMoi(e.target.value);
                setErrorsThem((prev) => ({ ...prev, chatLieu: "" }));
              }}
              placeholder="Chất liệu sản phẩm"
              maxLength={100}
              className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              disabled={isProcessing}
            />
            {errorsThem.chatLieu && (
              <p className="text-red-500 text-sm mt-1">{errorsThem.chatLieu}</p>
            )}
          </div>

          {/* Hình Ảnh */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Hình Ảnh
            </label>
            <label
              htmlFor="fileInputImages"
              className={`block border-2 border-dashed rounded-lg p-4 text-center transition hover:bg-gray-50 cursor-pointer ${
                isDraggingImages ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagesPreview.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {imagesPreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-24 w-full object-cover rounded"
                        onError={(e) =>
                          (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        disabled={isProcessing}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Kéo thả hoặc chọn ảnh</p>
                  <span className="text-indigo-500 hover:underline text-sm">Chọn tệp</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="fileInputImages"
                onChange={handleFileInputChange}
                disabled={isProcessing}
              />
            </label>
            {errorsThem.images && (
              <p className="text-red-500 text-sm mt-1">{errorsThem.images}</p>
            )}
          </div>

          {/* Biến Thể */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Biến Thể
            </label>
            {variants.map((variant, formIndex) => (
              <div
                key={formIndex}
                className="bg-white shadow-md rounded-lg border-2 border-gray-300 p-4 mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                        Màu Sắc
                      </label>
                      <select
                        value={variant.maMauMoi}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[formIndex].maMauMoi = e.target.value;
                          newVariants[formIndex].errorsThem.mau = "";
                          setVariants(newVariants);
                        }}
                        className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
                        disabled={isProcessing}
                      >
                        <option value="">Chọn màu sắc</option>
                        {mauList.map((mau) => (
                          <option key={mau.maDanhMuc} value={mau.maDanhMuc}>
                            {mau.tenDanhMuc}
                          </option>
                        ))}
                      </select>
                      {variant.errorsThem.mau && (
                        <p className="text-red-500 text-sm mt-1">{variant.errorsThem.mau}</p>
                      )}
                    </div>
                    <div className="col-span-1 row-span-2">
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                        Hình Ảnh
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center ${
                          isDragging === formIndex ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
                        }`}
                        onDragOver={(e) => handleVariantDragOver(e, formIndex)}
                        onDragLeave={handleVariantDragLeave}
                        onDrop={(e) => handleVariantDrop(e, formIndex)}
                      >
                        {variant.hinhAnhPreview ? (
                          <div className="relative mx-auto w-32 sm:w-64">
                            <img
                              src={variant.hinhAnhPreview}
                              alt="Preview"
                              className="h-24 sm:h-48 w-56 object-cover rounded"
                            />
                            <button
                              onClick={() => clearVariantImage(formIndex)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                              disabled={isProcessing}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-8 w-8 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Kéo thả hoặc chọn ảnh</p>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id={`fileInputThem-${formIndex}`}
                              onChange={(e) => handleVariantFileInputChange(e, formIndex)}
                              disabled={isProcessing}
                            />
                            <label
                              htmlFor={`fileInputThem-${formIndex}`}
                              className="cursor-pointer text-indigo-500 hover:underline text-sm"
                            >
                              Chọn tệp
                            </label>
                          </div>
                        )}
                      </div>
                      {variant.errorsThem.hinhAnh && (
                        <p className="text-red-500 text-sm mt-1">{variant.errorsThem.hinhAnh}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        onClick={() => removeVariantForm(formIndex)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-md"
                        disabled={isProcessing || variants.length === 1}
                      >
                        <FaTrash className="h-4 w-4 mr-2" /> Xóa Biến Thể
                      </Button>
                      <Button
                        onClick={addNewVariantForm}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2 px-4 rounded-md"
                        disabled={isProcessing}
                      >
                        <FaPlus className="h-4 w-4 mr-2" /> Thêm Biến Thể
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2 rounded-lg border-gray-300">
                    <div className="space-y-4">
                      {variant.sizeForms.map((size, sizeIndex) => (
                        <div
                          key={sizeIndex}
                          className="border-2 border-gray-300 rounded-md p-4 grid grid-cols-2 gap-4"
                        >
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Giá Nhập
                              </label>
                              <Input
                                type="number"
                                value={size.giaNhap}
                                onChange={(e) =>
                                  updateSizeForm(formIndex, sizeIndex, "giaNhap", e.target.value)
                                }
                                placeholder="Giá nhập"
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                disabled={isProcessing}
                              />
                              {variant.errorsThem.sizes[sizeIndex].giaNhap && (
                                <p className="text-red-500 text-sm mt-1">
                                  {variant.errorsThem.sizes[sizeIndex].giaNhap}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Kích Thước
                              </label>
                              <select
                                value={size.maKichThuoc}
                                onChange={(e) =>
                                  updateSizeForm(formIndex, sizeIndex, "maKichThuoc", e.target.value)
                                }
                                className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
                                disabled={isProcessing}
                              >
                                <option value="">Chọn kích thước</option>
                                {kichThuocList.map((kt) => (
                                  <option key={kt.maDanhMuc} value={kt.maDanhMuc}>
                                    {kt.tenDanhMuc}
                                  </option>
                                ))}
                              </select>
                              {variant.errorsThem.sizes[sizeIndex].kichThuoc && (
                                <p className="text-red-500 text-sm mt-1">
                                  {variant.errorsThem.sizes[sizeIndex].kichThuoc}
                                </p>
                              )}
                            </div>
                            
                            {size.showKhuyenMai && (
                              <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                  Khuyến Mãi (%)
                                </label>
                                <Input
                                  type="number"
                                  value={size.khuyenMai}
                                  onChange={(e) =>
                                    updateSizeForm(formIndex, sizeIndex, "khuyenMai", e.target.value)
                                  }
                                  placeholder="Phần trăm khuyến mãi (0-100)"
                                  min="0"
                                  max="100"
                                  className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                  disabled={isProcessing}
                                />
                                {variant.errorsThem.sizes[sizeIndex].khuyenMai && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {variant.errorsThem.sizes[sizeIndex].khuyenMai}
                                  </p>
                                )}
                              </div>
                            )}
                            {size.showKhuyenMai && (
                              <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                  Giá Trị Sau Khuyến Mãi
                                </label>
                                <Input
                                  type="number"
                                  value={size.giaTri}
                                  readOnly
                                  placeholder="Giá sau khuyến mãi"
                                  className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-100"
                                  disabled
                                />
                                {variant.errorsThem.sizes[sizeIndex].giaTri && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {variant.errorsThem.sizes[sizeIndex].giaTri}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Giá Bán
                              </label>
                              <Input
                                type="number"
                                value={size.giaBan}
                                onChange={(e) =>
                                  updateSizeForm(formIndex, sizeIndex, "giaBan", e.target.value)
                                }
                                placeholder="Giá bán"
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                disabled={isProcessing}
                              />
                              {variant.errorsThem.sizes[sizeIndex].giaBan && (
                                <p className="text-red-500 text-sm mt-1">
                                  {variant.errorsThem.sizes[sizeIndex].giaBan}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Số Lượng
                              </label>
                              <Input
                                type="number"
                                value={size.soLuong}
                                onChange={(e) =>
                                  updateSizeForm(formIndex, sizeIndex, "soLuong", e.target.value)
                                }
                                placeholder="Số lượng"
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                disabled={isProcessing}
                              />
                              {variant.errorsThem.sizes[sizeIndex].soLuong && (
                                <p className="text-red-500 text-sm mt-1">
                                  {variant.errorsThem.sizes[sizeIndex].soLuong}
                                </p>
                              )}
                            </div>
                                                        <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Mã Vạch
                              </label>
                              <Input
                                value={size.maVach}
                                onChange={(e) =>
                                  updateSizeForm(formIndex, sizeIndex, "maVach", e.target.value)
                                }
                                placeholder="Mã vạch (tùy chọn, tối đa 13 số)"
                                maxLength={13}
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                disabled={isProcessing}
                              />
                              {variant.errorsThem.sizes[sizeIndex].maVach && (
                                <p className="text-red-500 text-sm mt-1">
                                  {variant.errorsThem.sizes[sizeIndex].maVach}
                                </p>
                              )}
                            </div>
                            <div className="mt-2">
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Khuyến Mãi
                              </label>
                              <Button
                                onClick={() => toggleKhuyenMai(formIndex, sizeIndex)}
                                className={`w-full text-white text-sm py-2 px-4 rounded-md ${
                                  size.showKhuyenMai
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                }`}
                                disabled={isProcessing}
                              >
                                {size.showKhuyenMai ? (
                                  <>
                                    <FaTrash className="h-4 w-4 mr-2" /> Xóa Khuyến Mãi
                                  </>
                                ) : (
                                  <>
                                    <FaPlus className="h-4 w-4 mr-2" /> Thêm Khuyến Mãi
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="col-span-2 flex space-x-2 mt-2">
                            {variant.sizeForms.length > 1 && (
                              <Button
                                onClick={() => removeSizeForm(formIndex, sizeIndex)}
                                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-md"
                                disabled={isProcessing}
                              >
                                <FaTrash className="h-4 w-4 mr-2" /> Xóa Kích Thước
                              </Button>
                            )}
                            {sizeIndex === variant.sizeForms.length - 1 && (
                              <Button
                                onClick={() => addSizeForm(formIndex)}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2 px-4 rounded-md"
                                disabled={isProcessing}
                              >
                                <FaPlus className="h-4 w-4 mr-2" /> Thêm Kích Thước
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mô Tả */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Mô Tả
            </label>
            <textarea
              value={moTaMoi}
              onChange={(e) => {
                setMoTaMoi(e.target.value);
                setErrorsThem((prev) => ({ ...prev, moTa: "" }));
              }}
              placeholder="Mô tả sản phẩm"
              maxLength={10000}
              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              rows={4}
              disabled={isProcessing}
            />
            {errorsThem.moTa && (
              <p className="text-red-500 text-sm mt-1">{errorsThem.moTa}</p>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm py-2 px-4 rounded-md"
          >
            <X className="h-4 w-4 mr-2" /> Hủy
          </Button>
          <Button
            onClick={themSanPham}
            disabled={isProcessing}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2 px-4 rounded-md"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang xử lý...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Thêm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemSanPham;