import { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/pages/ui/card";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/pages/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/pages/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/pages/ui/dialog";
import { Search, MoreVertical, Upload, X, Plus, Loader2, ChevronLeft, ChevronRight, Download, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
  loaiDanhMuc: number;
  hinhAnh: string | null;
  ngayTao: string;
  trangThai: number;
}

const ITEMS_PER_PAGE = 10;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";
const TITLE = import.meta.env.VITE_TITLE || "Fashion";

const AdminDanhMuc = () => {
  const [danhMucList, setDanhMucList] = useState<DanhMuc[]>([]);
  const [filteredDanhMucList, setFilteredDanhMucList] = useState<DanhMuc[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "0" | "1">("all");
  const [loaiDanhMucFilter, setLoaiDanhMucFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [moModalThem, setMoModalThem] = useState(false);
  const [moModalSua, setMoModalSua] = useState(false);
  const [moModalXoa, setMoModalXoa] = useState(false);
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [moModalTrangThai, setMoModalTrangThai] = useState(false);
  const [danhMucCanXoa, setDanhMucCanXoa] = useState<DanhMuc | null>(null);
  const [danhMucChiTiet, setDanhMucChiTiet] = useState<DanhMuc | null>(null);
  const [danhMucDangSua, setDanhMucDangSua] = useState<DanhMuc | null>(null);
  const [danhMucCanDoiTrangThai, setDanhMucCanDoiTrangThai] = useState<{ danhMuc: DanhMuc; newStatus: number } | null>(null);
  const [tenDanhMucMoi, setTenDanhMucMoi] = useState("");
  const [loaiDanhMucMoi, setLoaiDanhMucMoi] = useState("");
  const [hinhAnhMoi, setHinhAnhMoi] = useState<File | null>(null);
  const [hinhAnhPreview, setHinhAnhPreview] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [errorsThem, setErrorsThem] = useState({ ten: "", loai: "", hinhAnh: "" });
  const [errorsSua, setErrorsSua] = useState({ ten: "", loai: "", hinhAnh: "" });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const openConfirmStatusModal = (danhMuc: DanhMuc, newStatus: number) => {
    setDanhMucCanDoiTrangThai({ danhMuc, newStatus });
    setMoModalTrangThai(true);
  };

  const fetchDanhMuc = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/DanhMuc`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Không tìm thấy dữ liệu danh mục.");
        if (response.status === 500) {
          const errorData = await response.json();
          throw new Error(errorData.Detail || "Lỗi máy chủ, vui lòng thử lại sau.");
        }
        throw new Error("Không thể lấy danh sách danh mục.");
      }

      const data: DanhMuc[] = await response.json();
      data.sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime());
      setDanhMucList(data);
      setFilteredDanhMucList(data);
    } catch (error) {
      setError((error as Error).message);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi tải danh sách danh mục: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDanhMuc();
  }, [fetchDanhMuc]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      let filtered = [...danhMucList];

      if (searchTerm) {
        try {
          const response = await fetch(`${API_URL}/api/DanhMuc/search?keyword=${encodeURIComponent(searchTerm)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            filtered = await response.json();
          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Không thể tìm kiếm danh mục.",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
              showCloseButton: true,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: `Lỗi khi tìm kiếm: ${(error as Error).message}`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true,
          });
        }
      }

      if (statusFilter !== "all") {
        try {
          const response = await fetch(`${API_URL}/api/DanhMuc/filter/status/${statusFilter}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            filtered = await response.json();
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: `Lỗi khi lọc theo trạng thái: ${(error as Error).message}`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true,
          });
        }
      }

      if (loaiDanhMucFilter !== "all") {
        try {
          const response = await fetch(`${API_URL}/api/DanhMuc/filter/type/${loaiDanhMucFilter}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            filtered = await response.json();
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: `Lỗi khi lọc theo loại danh mục: ${(error as Error).message}`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true,
          });
        }
      }

      setFilteredDanhMucList(filtered);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, danhMucList, statusFilter, loaiDanhMucFilter]);

  const exportToExcel = () => {
    const data = filteredDanhMucList.map((danhMuc, index) => ({
      STT: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
      "Mã Danh Mục": danhMuc.maDanhMuc,
      "Tên Danh Mục": danhMuc.tenDanhMuc,
      "Loại Danh Mục": danhMuc.loaiDanhMuc === 1 ? "Loại sản phẩm" :
        danhMuc.loaiDanhMuc === 2 ? "Thương hiệu" :
          danhMuc.loaiDanhMuc === 3 ? "Hashtag" :
            danhMuc.loaiDanhMuc === 4 ? "Kích thước" :
              danhMuc.loaiDanhMuc === 5 ? "Màu sắc" : danhMuc.loaiDanhMuc,
      "Trạng Thái": danhMuc.trangThai === 1 ? "Kích hoạt" : "Vô hiệu hóa",
      "Ngày Tạo": new Date(danhMuc.ngayTao).toLocaleDateString("vi-VN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const date = new Date().toLocaleDateString("vi-VN").replace(/\//g, "-");
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách danh mục");
    XLSX.writeFile(workbook, `DanhSachDanhMuc_${date}.xlsx`);
  };

  const handleFile = (file: File) => {
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

    setHinhAnhMoi(file);
    const reader = new FileReader();
    reader.onloadend = () => setHinhAnhPreview(reader.result as string);
    reader.readAsDataURL(file);
    setErrorsThem(prev => ({ ...prev, hinhAnh: "" }));
    setErrorsSua(prev => ({ ...prev, hinhAnh: "" }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setHinhAnhMoi(null);
    setHinhAnhPreview("");
  };

  const validateThem = () => {
    let valid = true;
    const newErrors = { ten: "", loai: "", hinhAnh: "" };

    if (!tenDanhMucMoi.trim()) {
      newErrors.ten = "Tên danh mục không được để trống!";
      valid = false;
    } else if (tenDanhMucMoi.length > 50) {
      newErrors.ten = "Tên danh mục không được dài quá 50 ký tự!";
      valid = false;
    }

    if (!loaiDanhMucMoi.trim()) {
      newErrors.loai = "Loại danh mục không được để trống!";
      valid = false;
    } else if (isNaN(parseInt(loaiDanhMucMoi)) || parseInt(loaiDanhMucMoi) < 1 || parseInt(loaiDanhMucMoi) > 5) {
      newErrors.loai = "Loại danh mục phải từ 1 đến 5!";
      valid = false;
    }

    if (!hinhAnhMoi) {
      newErrors.hinhAnh = "Hình ảnh không được để trống!";
      valid = false;
    }

    setErrorsThem(newErrors);
    return valid;
  };

  const validateSua = () => {
    let valid = true;
    const newErrors = { ten: "", loai: "", hinhAnh: "" };

    if (!danhMucDangSua?.tenDanhMuc.trim()) {
      newErrors.ten = "Tên danh mục không được để trống!";
      valid = false;
    } else if (danhMucDangSua.tenDanhMuc.length > 50) {
      newErrors.ten = "Tên danh mục không được dài quá 50 ký tự!";
      valid = false;
    }

    setErrorsSua(newErrors);
    return valid;
  };

  const themDanhMuc = async () => {
    if (!validateThem()) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("TenDanhMuc", tenDanhMucMoi.trim());
      formData.append("LoaiDanhMuc", loaiDanhMucMoi);
      formData.append("TrangThai", "1");
      if (hinhAnhMoi) formData.append("imageFile", hinhAnhMoi);

      const response = await fetch(`${API_URL}/api/DanhMuc`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Không thể thêm danh mục.");
      }

      setTenDanhMucMoi("");
      setLoaiDanhMucMoi("");
      setHinhAnhMoi(null);
      setHinhAnhPreview("");
      setErrorsThem({ ten: "", loai: "", hinhAnh: "" });
      setMoModalThem(false);
      await fetchDanhMuc();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm danh mục thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi thêm danh mục: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const suaDanhMuc = async () => {
    if (!danhMucDangSua || !validateSua()) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("MaDanhMuc", danhMucDangSua.maDanhMuc.toString());
      formData.append("TenDanhMuc", danhMucDangSua.tenDanhMuc.trim());
      formData.append("LoaiDanhMuc", danhMucDangSua.loaiDanhMuc.toString());
      formData.append("TrangThai", danhMucDangSua.trangThai.toString());
      if (hinhAnhMoi) {
        formData.append("imageFile", hinhAnhMoi);
      } else if (danhMucDangSua.hinhAnh) {
        formData.append("HinhAnh", danhMucDangSua.hinhAnh);
      }

      const response = await fetch(`${API_URL}/api/DanhMuc/${danhMucDangSua.maDanhMuc}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Không thể cập nhật danh mục.");
      }

      setMoModalSua(false);
      setDanhMucDangSua(null);
      setHinhAnhMoi(null);
      setHinhAnhPreview("");
      setErrorsSua({ ten: "", loai: "", hinhAnh: "" });
      await fetchDanhMuc();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật danh mục thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi cập nhật danh mục: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const xoaDanhMuc = async () => {
    if (!danhMucCanXoa) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/DanhMuc/${danhMucCanXoa.maDanhMuc}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Không thể xóa danh mục.");
      }

      setMoModalXoa(false);
      setDanhMucCanXoa(null);
      setCurrentPage(1);
      await fetchDanhMuc();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã xóa danh mục vĩnh viễn!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi xóa danh mục: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const changeStatus = async () => {
    if (!danhMucCanDoiTrangThai) return;

    setIsProcessing(true);
    try {
      const { danhMuc, newStatus } = danhMucCanDoiTrangThai;
      const formData = new FormData();
      formData.append("MaDanhMuc", danhMuc.maDanhMuc.toString());
      formData.append("TenDanhMuc", danhMuc.tenDanhMuc);
      formData.append("LoaiDanhMuc", danhMuc.loaiDanhMuc.toString());
      formData.append("TrangThai", newStatus.toString());
      if (danhMuc.hinhAnh) {
        formData.append("HinhAnh", danhMuc.hinhAnh);
      }

      const response = await fetch(`${API_URL}/api/DanhMuc/${danhMuc.maDanhMuc}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Không thể cập nhật trạng thái.");
      }

      setMoModalTrangThai(false);
      setDanhMucCanDoiTrangThai(null);
      await fetchDanhMuc();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: `Đã ${newStatus === 1 ? "kích hoạt" : "vô hiệu hóa"} danh mục!`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi cập nhật trạng thái: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as "all" | "0" | "1");
  };

  const handleLoaiDanhMucFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoaiDanhMucFilter(e.target.value);
  };

  const totalPages = Math.ceil(filteredDanhMucList.length / ITEMS_PER_PAGE);
  const paginatedDanhMucList = useMemo(() => {
    return filteredDanhMucList.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredDanhMucList, currentPage]);

  return (
    <div className="space-y-4 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
          Quản Lý Danh Mục - {TITLE}
        </h1>
        <Button
          className="w-full sm:w-auto bg-[#9b87f5] hover:bg-[#8a76e3] text-white text-sm sm:text-base py-2 px-4 rounded-md"
          onClick={() => setMoModalThem(true)}
          disabled={loading || isProcessing}
        >
          <FaPlus className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Input
            type="search"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border-gray-300 rounded-md focus:ring-[#9b87f5] focus:border-[#9b87f5] bg-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-[#9b87f5] focus:border-[#9b87f5] bg-white appearance-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="1">Kích hoạt</option>
            <option value="0">Vô hiệu hóa</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={loaiDanhMucFilter}
            onChange={handleLoaiDanhMucFilterChange}
            className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-[#9b87f5] focus:border-[#9b87f5] bg-white appearance-none"
          >
            <option value="all">Tất cả loại</option>
            <option value="1">Loại sản phẩm</option>
            <option value="2">Thương hiệu</option>
            <option value="3">Hashtag</option>
            <option value="4">Kích thước</option>
            <option value="5">Màu sắc</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
        <Button
          className="w-full sm:w-auto bg-[#9b87f5] hover:bg-[#8a76e3] text-white text-sm sm:text-base py-2 px-4 rounded-md"
          onClick={exportToExcel}
          disabled={loading || isProcessing || filteredDanhMucList.length === 0}
        >
          <Download className="mr-2 h-4 w-4" /> Xuất Excel
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>
      ) : (
        <>
          <Card className="overflow-x-auto bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-gray-800">Danh sách danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="text-sm sm:text-base">STT</TableHead>
                    <TableHead className="text-sm sm:text-base">Hình Ảnh</TableHead>
                    <TableHead className="text-sm sm:text-base">Tên Danh Mục</TableHead>
                    <TableHead className="text-sm sm:text-base">Loại Danh Mục</TableHead>
                    <TableHead className="text-sm sm:text-base">Trạng Thái</TableHead>
                    <TableHead className="text-sm sm:text-base">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDanhMucList.length > 0 ? (
                    paginatedDanhMucList.map((danhMuc, index) => (
                      <TableRow key={danhMuc.maDanhMuc} className="hover:bg-gray-50">
                        <TableCell className="text-sm sm:text-base">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {danhMuc.hinhAnh ? (
                            <img
                              src={`${API_URL}${danhMuc.hinhAnh}`}
                              alt={danhMuc.tenDanhMuc}
                              className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded cursor-pointer"
                              onClick={() => {
                                setDanhMucChiTiet(danhMuc);
                                setMoModalChiTiet(true);
                              }}
                              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
                            />
                          ) : (
                            <img
                              src="https://via.placeholder.com/150?text=No+Image"
                              alt="No Image"
                              className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">{danhMuc.tenDanhMuc}</TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {danhMuc.loaiDanhMuc === 1 ? "Loại sản phẩm" :
                            danhMuc.loaiDanhMuc === 2 ? "Thương hiệu" :
                              danhMuc.loaiDanhMuc === 3 ? "Hashtag" :
                                danhMuc.loaiDanhMuc === 4 ? "Kích thước" :
                                  danhMuc.loaiDanhMuc === 5 ? "Màu sắc" : danhMuc.loaiDanhMuc}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          <label className="relative inline-block w-14 h-7">
                            <input
                              type="checkbox"
                              className="opacity-0 w-0 h-0"
                              checked={danhMuc.trangThai === 1}
                              onChange={(e) => openConfirmStatusModal(danhMuc, e.target.checked ? 1 : 0)}
                              disabled={isProcessing}
                            />
                            <span
                              className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                                  before:absolute before:h-6 before:w-6 before:left-0.5 before:bottom-0.5
                                  before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                                  ${danhMuc.trangThai === 1
                                  ? "bg-[#9b87f5] before:translate-x-7"
                                  : "bg-gray-400"
                                } hover:scale-105 shadow-sm hover:shadow-md`}
                            ></span>
                            <span className="sr-only">
                              {danhMuc.trangThai === 1 ? "Kích hoạt" : "Vô hiệu hóa"}
                            </span>
                          </label>
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setDanhMucChiTiet(danhMuc);
                                  setMoModalChiTiet(true);
                                }}
                                className="text-green-700 text-sm"
                              >
                                <FaEye className="mr-2 h-4 w-4" /> Xem
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDanhMucDangSua({ ...danhMuc });
                                  setHinhAnhPreview(danhMuc.hinhAnh ? `${API_URL}${danhMuc.hinhAnh}` : "");
                                  setHinhAnhMoi(null);
                                  setMoModalSua(true);
                                }}
                                className="text-blue-700 text-sm"
                              >
                                <FaEdit className="mr-2 h-4 w-4" /> Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDanhMucCanXoa(danhMuc);
                                  setMoModalXoa(true);
                                }}
                                className="text-red-700 text-sm"
                              >
                                <FaTrash className="mr-2 h-4 w-4" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-sm sm:text-base text-gray-500">
                        Không tìm thấy danh mục nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isProcessing}
                variant="outline"
                className="text-sm py-2 px-3 w-12 h-12 rounded-md border-gray-300 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`text-sm py-2 px-3 w-12 h-12 rounded-md ${currentPage === page ? "bg-[#9b87f5] text-white hover:bg-[#8a76e3]" : "border-gray-300 hover:bg-gray-100"}`}
                  disabled={isProcessing}
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isProcessing}
                variant="outline"
                className="text-sm py-2 px-3 w-12 h-12 rounded-md border-gray-300 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={moModalThem} onOpenChange={(open) => {
        setMoModalThem(open);
        if (!open) {
          setTenDanhMucMoi("");
          setLoaiDanhMucMoi("");
          clearImage();
          setErrorsThem({ ten: "", loai: "", hinhAnh: "" });
        }
      }}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl bg-white rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-gray-800">Thêm Danh Mục</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Tên Danh Mục</label>
                <Input
                  value={tenDanhMucMoi}
                  onChange={(e) => {
                    setTenDanhMucMoi(e.target.value);
                    setErrorsThem(prev => ({ ...prev, ten: "" }));
                  }}
                  placeholder="Tên danh mục"
                  maxLength={50}
                  className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-[#9b87f5] focus:border-[#9b87f5] bg-white"
                  disabled={isProcessing}
                />
                {errorsThem.ten && <p className="text-red-500 text-sm mt-1">{errorsThem.ten}</p>}
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Loại Danh Mục</label>
                <select
                  value={loaiDanhMucMoi}
                  onChange={(e) => {
                    setLoaiDanhMucMoi(e.target.value);
                    setErrorsThem(prev => ({ ...prev, loai: "" }));
                  }}
                  className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-[#9b87f5] focus:border-[#9b87f5] bg-white appearance-none"
                  disabled={isProcessing}
                >
                  <option value="">Chọn loại danh mục</option>
                  <option value="1">Loại sản phẩm</option>
                  <option value="2">Thương hiệu</option>
                  <option value="3">Hashtag</option>
                  <option value="4">Kích thước</option>
                  <option value="5">Màu sắc</option>
                </select>
                {errorsThem.loai && <p className="text-red-500 text-sm mt-1">{errorsThem.loai}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Hình Ảnh</label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${isDragging ? "border-[#9b87f5] bg-purple-50" : "border-gray-300"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {hinhAnhPreview ? (
                  <div className="relative mx-auto w-32 sm:w-64">
                    <img
                      src={hinhAnhPreview}
                      alt="Preview"
                      className="h-24 sm:h-48 w-full object-cover rounded"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      disabled={isProcessing}
                    >
                      ✕
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
                      id="fileInputThem"
                      onChange={handleFileInputChange}
                      disabled={isProcessing}
                    />
                    <label htmlFor="fileInputThem" className="cursor-pointer text-[#9b87f5] hover:underline text-sm">
                      Chọn tệp
                    </label>
                  </div>
                )}
              </div>
              {errorsThem.hinhAnh && <p className="text-red-500 text-sm mt-1">{errorsThem.hinhAnh}</p>}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setMoModalThem(false);
                clearImage();
                setTenDanhMucMoi("");
                setLoaiDanhMucMoi("");
                setErrorsThem({ ten: "", loai: "", hinhAnh: "" });
              }}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-gray-800 hover:bg-[#d5d0f0] text-sm py-2 px-4 rounded-md"
            >
              <X className="h-4 w-4 mr-2" /> Hủy
            </Button>
            <Button
              onClick={themDanhMuc}
              disabled={isProcessing}
              className="bg-[#9b87f5] hover:bg-[#8a76e3] text-white text-sm py-2 px-4 rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" /> {isProcessing ? "Đang xử lý..." : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalSua} onOpenChange={(open) => {
        setMoModalSua(open);
        if (!open) {
          setDanhMucDangSua(null);
          clearImage();
          setErrorsSua({ ten: "", loai: "", hinhAnh: "" });
        }
      }}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl bg-white rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-gray-800">Sửa Danh Mục</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Tên Danh Mục</label>
                <Input
                  value={danhMucDangSua?.tenDanhMuc || ""}
                  onChange={(e) => {
                    setDanhMucDangSua(prev => prev ? { ...prev, tenDanhMuc: e.target.value } : prev);
                    setErrorsSua(prev => ({ ...prev, ten: "" }));
                  }}
                  placeholder="Tên danh mục"
                  maxLength={50}
                  className="text-sm sm:text-base text-black border-gray-300 rounded-md focus:ring-[#9b87f5] focus:border-[#9b87f5] bg-white"
                  disabled={isProcessing}
                />
                {errorsSua.ten && <p className="text-red-500 text-sm mt-1">{errorsSua.ten}</p>}
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Loại Danh Mục</label>
                <Input
                  value={danhMucDangSua?.loaiDanhMuc ?
                    (danhMucDangSua.loaiDanhMuc === 1 ? "Loại sản phẩm" :
                      danhMucDangSua.loaiDanhMuc === 2 ? "Thương hiệu" :
                        danhMucDangSua.loaiDanhMuc === 3 ? "Hashtag" :
                          danhMucDangSua.loaiDanhMuc === 4 ? "Kích thước" :
                            danhMucDangSua.loaiDanhMuc === 5 ? "Màu sắc" : danhMucDangSua.loaiDanhMuc) : ""}
                  disabled
                  className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Trạng Thái</label>
                <select
                  value={danhMucDangSua?.trangThai ?? ""}
                  onChange={(e) => {
                    setDanhMucDangSua(prev => prev ? { ...prev, trangThai: parseInt(e.target.value) } : prev);
                  }}
                  className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-[#9b87f5] focus:border-[#9b87f5] bg-white appearance-none"
                  disabled={isProcessing}
                >
                  <option value={1}>Kích hoạt</option>
                  <option value={0}>Vô hiệu hóa</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Hình Ảnh</label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${isDragging ? "border-[#9b87f5] bg-purple-50" : "border-gray-300"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {hinhAnhPreview ? (
                  <div className="relative mx-auto w-32 sm:w-64">
                    <img
                      src={hinhAnhPreview}
                      alt="Preview"
                      className="h-24 sm:h-48 w-full object-cover rounded"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      disabled={isProcessing}
                    >
                      ✕
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
                      id="fileInputSua"
                      onChange={handleFileInputChange}
                      disabled={isProcessing}
                    />
                    <label htmlFor="fileInputSua" className="cursor-pointer text-[#9b87f5] hover:underline text-sm">
                      Chọn tệp
                    </label>
                  </div>
                )}
              </div>
              {errorsSua.hinhAnh && <p className="text-red-500 text-sm mt-1">{errorsSua.hinhAnh}</p>}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setMoModalSua(false);
                clearImage();
                setDanhMucDangSua(null);
                setErrorsSua({ ten: "", loai: "", hinhAnh: "" });
              }}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-gray-800 hover:bg-[#d5d0f0] text-sm py-2 px-4 rounded-md"
            >
              <X className="h-4 w-4 mr-2" /> Hủy
            </Button>
            <Button
              onClick={suaDanhMuc}
              disabled={isProcessing}
              className="bg-[#9b87f5] hover:bg-[#8a76e3] text-white text-sm py-2 px-4 rounded-md"
            >
              <FaEdit className="h-4 w-4 mr-2" /> {isProcessing ? "Đang xử lý..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalChiTiet} onOpenChange={setMoModalChiTiet}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl bg-white rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-gray-800">Chi Tiết Danh Mục</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Tên Danh Mục</label>
                <Input value={danhMucChiTiet?.tenDanhMuc || ""} disabled className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Loại Danh Mục</label>
                <Input
                  value={danhMucChiTiet?.loaiDanhMuc ?
                    (danhMucChiTiet.loaiDanhMuc === 1 ? "Loại sản phẩm" :
                      danhMucChiTiet.loaiDanhMuc === 2 ? "Thương hiệu" :
                        danhMucChiTiet.loaiDanhMuc === 3 ? "Hashtag" :
                          danhMucChiTiet.loaiDanhMuc === 4 ? "Kích thước" :
                            danhMucChiTiet.loaiDanhMuc === 5 ? "Màu sắc" : danhMucChiTiet.loaiDanhMuc) : ""}
                  disabled
                  className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Ngày Tạo</label>
                <Input
                  value={danhMucChiTiet ? new Date(danhMucChiTiet.ngayTao).toLocaleDateString("vi-VN") : ""}
                  disabled
                  className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Trạng Thái</label>
                <Input
                  value={danhMucChiTiet?.trangThai === 1 ? "Kích hoạt" : "Vô hiệu hóa"}
                  disabled
                  className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Hình Ảnh</label>
              {danhMucChiTiet?.hinhAnh ? (
                <div className="border-2 border-dashed rounded-lg p-4 text-center border-gray-300 mx-auto w-full sm:w-96">
                  <img
                    src={`${API_URL}${danhMucChiTiet.hinhAnh}`}
                    alt={danhMucChiTiet.tenDanhMuc}
                    className="h-48 w-full object-cover rounded"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
                  />
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500">Không có hình ảnh</p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end mt-4">
            <Button
              variant="ghost"
              onClick={() => setMoModalChiTiet(false)}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-gray-800 hover:bg-[#d5d0f0] text-sm py-2 px-4 rounded-md"
            >
              <X className="h-4 w-4 mr-2" /> Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalXoa} onOpenChange={(open) => {
        setMoModalXoa(open);
        if (!open) setDanhMucCanXoa(null);
      }}>
        <DialogContent className="w-full max-w-md sm:max-w-lg bg-white rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-gray-800">Xác nhận xóa danh mục</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600">
              Bạn có chắc chắn muốn xóa danh mục: <strong>{danhMucCanXoa?.tenDanhMuc}</strong> này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setMoModalXoa(false)}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-gray-800 hover:bg-[#d5d0f0] text-sm py-2 px-4 rounded-md"
            >
              <X className="h-4 w-4 mr-2" /> Hủy
            </Button>
            <Button
              onClick={xoaDanhMuc}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-md"
            >
              <FaTrash className="h-4 w-4 mr-2" /> {isProcessing ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalTrangThai} onOpenChange={(open) => {
        setMoModalTrangThai(open);
        if (!open) setDanhMucCanDoiTrangThai(null);
      }}>
        <DialogContent className="w-full max-w-md sm:max-w-lg bg-white rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-gray-800">Xác nhận thay đổi trạng thái</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600">
              Bạn có chắc chắn muốn {danhMucCanDoiTrangThai?.newStatus === 1 ? "kích hoạt" : "vô hiệu hóa"} danh mục <strong>{danhMucCanDoiTrangThai?.danhMuc.tenDanhMuc}</strong> không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setMoModalTrangThai(false)}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-gray-800 hover:bg-[#d5d0f0] text-sm py-2 px-4 rounded-md"
            >
              <X className="h-4 w-4 mr-2" /> Hủy
            </Button>
            <Button
              onClick={changeStatus}
              disabled={isProcessing}
              className="bg-[#9b87f5] hover:bg-[#8a76e3] text-white text-sm py-2 px-4 rounded-md"
            >
              <FaEdit className="h-4 w-4 mr-2" /> {isProcessing ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDanhMuc;