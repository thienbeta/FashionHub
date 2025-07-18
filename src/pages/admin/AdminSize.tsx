import { useState, useEffect, useCallback } from "react";
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

enum TrangThai {
  HoatDong = 0,
  Khoa = 1
}

interface KichThuoc {
  maKichThuoc: number;
  tenKichThuoc: string;
  moTa: string;
  hinhAnh: string;
  ngayTao: string;
  trangThai: TrangThai;
}

const ITEMS_PER_PAGE = 10;
const API_URL = import.meta.env.VITE_API_URL;

const AdminSize = () => {
  const [kichThuocList, setKichThuocList] = useState<KichThuoc[]>([]);
  const [filteredKichThuocList, setFilteredKichThuocList] = useState<KichThuoc[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "0" | "1">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [moModalThem, setMoModalThem] = useState(false);
  const [moModalSua, setMoModalSua] = useState(false);
  const [moModalXoa, setMoModalXoa] = useState(false);
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [moModalTrangThai, setMoModalTrangThai] = useState(false);
  const [kichThuocCanXoa, setKichThuocCanXoa] = useState<KichThuoc | null>(null);
  const [kichThuocChiTiet, setKichThuocChiTiet] = useState<KichThuoc | null>(null);
  const [kichThuocDangSua, setKichThuocDangSua] = useState<KichThuoc | null>(null);
  const [kichThuocCanDoiTrangThai, setKichThuocCanDoiTrangThai] = useState<{ kichThuoc: KichThuoc; newStatus: number } | null>(null);
  const [tenKichThuocMoi, setTenKichThuocMoi] = useState("");
  const [moTaMoi, setMoTaMoi] = useState("");
  const [hinhAnhMoi, setHinhAnhMoi] = useState<File | null>(null);
  const [hinhAnhPreview, setHinhAnhPreview] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [errorsThem, setErrorsThem] = useState({ ten: "", moTa: "", hinhAnh: "" });
  const [errorsSua, setErrorsSua] = useState({ ten: "", moTa: "", hinhAnh: "" });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fetchKichThuoc = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/KichThuoc/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Không tìm thấy dữ liệu kích thước.");
        if (response.status === 500) throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        throw new Error("Không thể lấy danh sách kích thước.");
      }

      const data: KichThuoc[] = await response.json();
      data.sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime());
      setKichThuocList(data);
    } catch (error) {
      setError((error as Error).message);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi tải danh sách kích thước: ${(error as Error).message}`,
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKichThuoc();
  }, [fetchKichThuoc]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = kichThuocList.filter(
        k =>
          k.tenKichThuoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          k.moTa?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (statusFilter !== "all") {
        filtered = filtered.filter(k => k.trangThai === parseInt(statusFilter));
      }

      setFilteredKichThuocList(filtered);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, kichThuocList, statusFilter]);

  const exportToExcel = () => {
    const data = filteredKichThuocList.map((kichThuoc, index) => ({
      STT: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
      "Mã Kích Thước": kichThuoc.maKichThuoc,
      "Tên Kích Thước": kichThuoc.tenKichThuoc,
      "Mô Tả": kichThuoc.moTa || "Không có",
      "Trạng Thái": kichThuoc.trangThai === 0 ? "Hoạt động" : "Khóa",
      "Ngày Tạo": new Date(kichThuoc.ngayTao).toLocaleDateString("vi-VN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách kích thước");
    XLSX.writeFile(workbook, "DanhSachKichThuoc.xlsx");
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn một tệp hình ảnh!",
        timer: 1000,
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
    const newErrors = { ten: "", moTa: "", hinhAnh: "" };

    if (!tenKichThuocMoi.trim()) {
      newErrors.ten = "Tên kích thước không được để trống!";
      valid = false;
    } else if (tenKichThuocMoi.length > 20) {
      newErrors.ten = "Tên kích thước không được dài quá 20 ký tự!";
      valid = false;
    } else if (kichThuocList.some(k => k.tenKichThuoc.toLowerCase() === tenKichThuocMoi.trim().toLowerCase())) {
      newErrors.ten = "Tên kích thước đã tồn tại!";
      valid = false;
    }

    if (!moTaMoi.trim()) {
      newErrors.moTa = "Mô tả không được để trống!";
      valid = false;
    } else if (moTaMoi.length < 5) {
      newErrors.moTa = "Mô tả phải ít nhất 5 ký tự!";
      valid = false;
    } else if (moTaMoi.length > 50) {
      newErrors.moTa = "Mô tả không được dài quá 50 ký tự!";
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
    const newErrors = { ten: "", moTa: "", hinhAnh: "" };

    if (!kichThuocDangSua?.tenKichThuoc.trim()) {
      newErrors.ten = "Tên kích thước không được để trống!";
      valid = false;
    } else if (kichThuocDangSua.tenKichThuoc.length > 20) {
      newErrors.ten = "Tên kích thước không được dài quá 20 ký tự!";
      valid = false;
    } else if (
      kichThuocList.some(
        k => k.maKichThuoc !== kichThuocDangSua.maKichThuoc && k.tenKichThuoc.toLowerCase() === kichThuocDangSua.tenKichThuoc.trim().toLowerCase()
      )
    ) {
      newErrors.ten = "Tên kích thước đã tồn tại!";
      valid = false;
    }

    if (!kichThuocDangSua?.moTa?.trim()) {
      newErrors.moTa = "Mô tả không được để trống!";
      valid = false;
    } else if (kichThuocDangSua.moTa.length < 5) {
      newErrors.moTa = "Mô tả phải ít nhất 5 ký tự!";
      valid = false;
    } else if (kichThuocDangSua.moTa.length > 50) {
      newErrors.moTa = "Mô tả không được dài quá 50 ký tự!";
      valid = false;
    }

    if (!kichThuocDangSua?.hinhAnh && !hinhAnhMoi) {
      newErrors.hinhAnh = "Hình ảnh không được để trống!";
      valid = false;
    }

    setErrorsSua(newErrors);
    return valid;
  };

  const themKichThuoc = async () => {
    if (!validateThem()) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("TenKichThuoc", tenKichThuocMoi.trim());
      formData.append("MoTa", moTaMoi.trim());
      if (hinhAnhMoi) formData.append("file", hinhAnhMoi);

      const response = await fetch(`${API_URL}/api/KichThuoc/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 400) throw new Error(errorText || "Tên kích thước đã tồn tại.");
        if (response.status === 500) throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        throw new Error(errorText || "Không thể thêm kích thước.");
      }

      setTenKichThuocMoi("");
      setMoTaMoi("");
      setHinhAnhMoi(null);
      setHinhAnhPreview("");
      setErrorsThem({ ten: "", moTa: "", hinhAnh: "" });
      setMoModalThem(false);
      await fetchKichThuoc();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm kích thước thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi thêm kích thước: ${(error as Error).message}`,
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const suaKichThuoc = async () => {
    if (!validateSua()) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("MaKichThuoc", kichThuocDangSua!.maKichThuoc.toString());
      formData.append("TenKichThuoc", kichThuocDangSua!.tenKichThuoc.trim());
      formData.append("MoTa", kichThuocDangSua!.moTa?.trim() || "");
      formData.append("TrangThai", kichThuocDangSua!.trangThai.toString());
      if (hinhAnhMoi) formData.append("file", hinhAnhMoi);

      const response = await fetch(`${API_URL}/api/KichThuoc/update`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 400) throw new Error(errorText || "Tên kích thước đã tồn tại.");
        if (response.status === 404) throw new Error(errorText || "Không tìm thấy kích thước.");
        if (response.status === 500) throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        throw new Error(errorText || "Không thể cập nhật kích thước.");
      }

      setMoModalSua(false);
      setKichThuocDangSua(null);
      setHinhAnhMoi(null);
      setHinhAnhPreview("");
      setErrorsSua({ ten: "", moTa: "", hinhAnh: "" });
      await fetchKichThuoc();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật kích thước thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi cập nhật kích thước: ${(error as Error).message}`,
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const xoaKichThuoc = async () => {
    if (!kichThuocCanXoa) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/KichThuoc/delete/${kichThuocCanXoa.maKichThuoc}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) throw new Error(errorText || "Không tìm thấy kích thước.");
        if (response.status === 500) throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        throw new Error(errorText || "Không thể xóa kích thước.");
      }

      setMoModalXoa(false);
      setKichThuocCanXoa(null);
      setCurrentPage(1);
      await fetchKichThuoc();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã xóa kích thước vĩnh viễn!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi xóa kích thước: ${(error as Error).message}`,
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const openConfirmStatusModal = (kichThuoc: KichThuoc, newStatus: number) => {
    setKichThuocCanDoiTrangThai({ kichThuoc, newStatus });
    setMoModalTrangThai(true);
  };

  const changeStatus = async () => {
    if (!kichThuocCanDoiTrangThai) return;

    setIsProcessing(true);
    try {
      const { kichThuoc, newStatus } = kichThuocCanDoiTrangThai;
      const formData = new FormData();
      formData.append("MaKichThuoc", kichThuoc.maKichThuoc.toString());
      formData.append("TenKichThuoc", kichThuoc.tenKichThuoc);
      formData.append("MoTa", kichThuoc.moTa || "");
      formData.append("TrangThai", newStatus.toString());

      const response = await fetch(`${API_URL}/api/KichThuoc/update`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 400) throw new Error(errorText || "Dữ liệu không hợp lệ.");
        if (response.status === 404) throw new Error(errorText || "Không tìm thấy kích thước.");
        if (response.status === 500) throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        throw new Error(errorText || "Không thể cập nhật trạng thái.");
      }

      setMoModalTrangThai(false);
      setKichThuocCanDoiTrangThai(null);
      await fetchKichThuoc();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: `Đã ${newStatus === 1 ? "kích hoạt" : "khóa"} kích thước!`,
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
        timer: 1000,
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

  const totalPages = Math.ceil(filteredKichThuocList.length / ITEMS_PER_PAGE);
  const paginatedKichThuocList = filteredKichThuocList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-800 mb-2 sm:mb-0">
          Quản Lý Kích Thước
        </h1>
        <Button
          className="w-full sm:w-auto bg-[#9b87f5] text-white hover:bg-[#8a76e3] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
          onClick={() => setMoModalThem(true)}
          disabled={loading || isProcessing}
        >
          <FaPlus className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" /> Thêm kích thước
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-8 pr-3 py-1 sm:py-2 text-sm sm:text-base border-gray-300 rounded-md focus:ring-[#9b87f5] focus:border-[#9b87f5] text-black"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="relative w-full sm:w-40">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full pl-3 pr-8 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:border-[#8a76e3] focus:bg-transparent text-gray-800 bg-transparent appearance-none"
          >
            <option value="all" className="text-gray-800 bg-white hover:bg-[#d9d3f0]">
              Tất cả
            </option>
            <option value="0" className="text-gray-800 bg-white hover:bg-[#d9d3f0]">
              Hoạt động
            </option>
            <option value="1" className="text-gray-800 bg-white hover:bg-[#d9d3f0]">
              Khóa
            </option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 pointer-events-none" />
        </div>

        <Button
          className="w-full sm:w-auto bg-[#9b87f5] text-white hover:bg-[#8a76e3] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
          onClick={exportToExcel}
          disabled={loading || isProcessing || filteredKichThuocList.length === 0}
        >
          <Download className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" /> Xuất Excel
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-6 sm:h-8 w-6 sm:w-8 animate-spin text-[#9b87f5]" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm sm:text-base">{error}</p>
      ) : (
        <>
          <Card className="overflow-x-auto">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">Danh sách kích thước</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%] sm:w-auto">STT</TableHead>
                    <TableHead className="w-[10%] sm:w-auto">Hình Ảnh</TableHead>
                    <TableHead className="w-[15%] sm:w-auto">Tên Kích Thước</TableHead>
                    <TableHead className="hidden sm:table-cell w-[20%]">Mô Tả</TableHead>
                    <TableHead className="w-[10%] sm:w-auto">Trạng Thái</TableHead>
                    <TableHead className="w-[10%] sm:w-auto">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedKichThuocList.length > 0 ? (
                    paginatedKichThuocList.map((kichThuoc, index) => (
                      <TableRow key={kichThuoc.maKichThuoc} className="hover:bg-muted/50">
                        <TableCell className="text-xs sm:text-sm">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {kichThuoc.hinhAnh ? (
                            <img
                              src={`${API_URL}${kichThuoc.hinhAnh}`}
                              alt={kichThuoc.tenKichThuoc}
                              className="h-8 sm:h-12 w-8 sm:w-12 object-cover rounded cursor-pointer"
                              onClick={() => {
                                setKichThuocChiTiet(kichThuoc);
                                setMoModalChiTiet(true);
                              }}
                              onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                            />
                          ) : (
                            "Không có hình"
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{kichThuoc.tenKichThuoc}</TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {kichThuoc.moTa || "Không có"}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <label className="relative inline-block w-[40px] sm:w-[60px] h-[24px] sm:h-[34px]">
                            <input
                              type="checkbox"
                              className="opacity-0 w-0 h-0"
                              checked={kichThuoc.trangThai === 1}
                              onChange={(e) => openConfirmStatusModal(kichThuoc, e.target.checked ? 1 : 0)}
                              disabled={isProcessing}
                            />
                            <span
                              className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                                  before:absolute before:h-[20px] sm:before:h-[30px] before:w-[20px] sm:before:w-[30px] before:left-[2px] before:bottom-[2px]
                                  before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                                  ${kichThuoc.trangThai === 1
                                  ? "bg-[#9b87f5] before:translate-x-[16px] sm:before:translate-x-[26px]"
                                  : "bg-gray-400"
                                } hover:scale-110 shadow-sm hover:shadow-md`}
                            ></span>
                            <span className="sr-only">
                              {kichThuoc.trangThai === 1 ? "Hoạt động" : "Khóa"}
                            </span>
                          </label>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 sm:h-8 w-6 sm:w-8">
                                <MoreVertical className="h-3 sm:h-4 w-3 sm:w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setKichThuocChiTiet(kichThuoc);
                                  setMoModalChiTiet(true);
                                }}
                                className="text-green-700 text-xs sm:text-sm"
                              >
                                <FaEye className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" /> Xem
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setKichThuocDangSua(kichThuoc);
                                  setHinhAnhPreview(kichThuoc.hinhAnh ? `${API_URL}${kichThuoc.hinhAnh}` : "");
                                  setMoModalSua(true);
                                }}
                                className="text-blue-700 text-xs sm:text-sm"
                              >
                                <FaEdit className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" /> Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setKichThuocCanXoa(kichThuoc);
                                  setMoModalXoa(true);
                                }}
                                className="text-red-700 text-xs sm:text-sm"
                              >
                                <FaTrash className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-2 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                        Không tìm thấy kích thước nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-2 sm:mt-4">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="flex items-center text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3 w-10 h-10 sm:w-12 sm:h-12"
              >
                <ChevronLeft className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3 w-10 h-10 sm:w-12 sm:h-12 ${currentPage === page ? "bg-[#9b87f5] text-white hover:bg-[#8a76e3]" : ""}`}
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="flex items-center text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3 w-10 h-10 sm:w-12 sm:h-12"
              >
                <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4 ml-1 sm:ml-2" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={moModalThem} onOpenChange={setMoModalThem}>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Thêm Kích Thước</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Tên Kích Thước</label>
                <Input
                  value={tenKichThuocMoi}
                  onChange={(e) => {
                    setTenKichThuocMoi(e.target.value);
                    setErrorsThem(prev => ({ ...prev, ten: "" }));
                  }}
                  placeholder="Tên kích thước"
                  maxLength={20}
                  className="text-sm sm:text-base text-black"
                  disabled={isProcessing}
                />
                {errorsThem.ten && <p className="text-red-500 text-xs sm:text-sm mt-1">{errorsThem.ten}</p>}
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Mô Tả</label>
                <Input
                  value={moTaMoi}
                  onChange={(e) => {
                    setMoTaMoi(e.target.value);
                    setErrorsThem(prev => ({ ...prev, moTa: "" }));
                  }}
                  placeholder="Mô tả"
                  maxLength={50}
                  className="text-sm sm:text-base text-black"
                  disabled={isProcessing}
                />
                {errorsThem.moTa && <p className="text-red-500 text-xs sm:text-sm mt-1">{errorsThem.moTa}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Hình Ảnh</label>
              <div
                className={`border-2 border-dashed rounded-lg p-2 sm:p-4 text-center ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {hinhAnhPreview ? (
                  <div className="relative mx-auto w-32 sm:w-64">
                    <img
                      src={hinhAnhPreview}
                      alt="Preview"
                      className="h-20 sm:h-40 w-32 sm:w-64 object-cover rounded"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-4 sm:w-6 h-4 sm:h-6 flex items-center justify-center"
                      disabled={isProcessing}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-6 sm:h-8 w-6 sm:w-8 mx-auto text-gray-400" />
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Chọn ảnh</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="fileInputThem"
                      onChange={handleFileInputChange}
                      disabled={isProcessing}
                    />
                    <label htmlFor="fileInputThem" className="cursor-pointer text-blue-500 hover:underline text-xs sm:text-sm">
                      Chọn tệp
                    </label>
                  </div>
                )}
              </div>
              {errorsThem.hinhAnh && <p className="text-red-500 text-xs sm:text-sm mt-1">{errorsThem.hinhAnh}</p>}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-2 sm:mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setMoModalThem(false);
                clearImage();
              }}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <X className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> Hủy
            </Button>
            <Button
              onClick={themKichThuoc}
              disabled={isProcessing}
              className="bg-[#9b87f5] text-white hover:bg-[#8a76e3] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <Plus className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> {isProcessing ? "Đang xử lý..." : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalSua} onOpenChange={setMoModalSua}>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Sửa Kích Thước</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Tên Kích Thước</label>
                <Input
                  value={kichThuocDangSua?.tenKichThuoc || ""}
                  onChange={(e) => setKichThuocDangSua(prev => ({ ...prev!, tenKichThuoc: e.target.value }))}
                  placeholder="Tên kích thước"
                  maxLength={20}
                  className="text-sm sm:text-base text-black"
                  disabled={isProcessing}
                />
                {errorsSua.ten && <p className="text-red-500 text-xs sm:text-sm mt-1">{errorsSua.ten}</p>}
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Mô Tả</label>
                <Input
                  value={kichThuocDangSua?.moTa || ""}
                  onChange={(e) => setKichThuocDangSua(prev => ({ ...prev!, moTa: e.target.value }))}
                  placeholder="Mô tả"
                  maxLength={50}
                  className="text-sm sm:text-base text-black"
                  disabled={isProcessing}
                />
                {errorsSua.moTa && <p className="text-red-500 text-xs sm:text-sm mt-1">{errorsSua.moTa}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Hình Ảnh</label>
              <div
                className={`border-2 border-dashed rounded-lg p-2 sm:p-4 text-center ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {hinhAnhPreview ? (
                  <div className="relative mx-auto w-32 sm:w-64">
                    <img
                      src={hinhAnhPreview}
                      alt="Preview"
                      className="h-20 sm:h-32 w-32 sm:w-64 object-cover rounded"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 sm:w-6 h-4 sm:h-6 flex items-center justify-center"
                      disabled={isProcessing}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-6 sm:h-8 w-6 sm:w-8 mx-auto text-gray-400" />
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Chọn ảnh</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="fileInputSua"
                      onChange={handleFileInputChange}
                      disabled={isProcessing}
                    />
                    <label htmlFor="fileInputSua" className="cursor-pointer text-blue-500 hover:underline text-xs sm:text-sm">
                      Chọn tệp
                    </label>
                  </div>
                )}
              </div>
              {errorsSua.hinhAnh && <p className="text-red-500 text-xs sm:text-sm mt-1">{errorsSua.hinhAnh}</p>}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-2 sm:mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setMoModalSua(false);
                clearImage();
              }}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <X className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> Hủy
            </Button>
            <Button
              onClick={suaKichThuoc}
              disabled={isProcessing}
              className="bg-[#9b87f5] text-white hover:bg-[#8a76e3] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <FaEdit className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> {isProcessing ? "Đang xử lý..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalChiTiet} onOpenChange={setMoModalChiTiet}>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Chi Tiết Kích Thước</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Tên Kích Thước</label>
                <Input value={kichThuocChiTiet?.tenKichThuoc || ""} disabled className="text-sm sm:text-base text-black" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">Mô Tả</label>
                <Input value={kichThuocChiTiet?.moTa || "Không có"} disabled className="text-sm sm:text-base text-black" />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Ngày Tạo</label>
                <Input
                  value={kichThuocChiTiet ? new Date(kichThuocChiTiet.ngayTao).toLocaleDateString("vi-VN") : ""}
                  disabled
                  className="text-sm sm:text-base text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Hình Ảnh</label>
              {kichThuocChiTiet?.hinhAnh ? (
                <div className="border-2 border-dashed rounded-lg p-2 sm:p-4 text-center border-gray-300 mx-auto w-64 sm:w-[25rem]">
                  <img
                    src={`${API_URL}${kichThuocChiTiet.hinhAnh}`}
                    alt={kichThuocChiTiet.tenKichThuoc}
                    className="h-40 sm:h-64 w-64 sm:w-[25rem] object-cover rounded"
                    onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                  />
                </div>
              ) : (
                <p className="text-center text-xs sm:text-sm">Không có hình ảnh</p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end mt-2 sm:mt-4">
            <Button
              variant="ghost"
              onClick={() => setMoModalChiTiet(false)}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <X className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalXoa} onOpenChange={setMoModalXoa}>
        <DialogContent className="w-full max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Xác nhận xóa kích thước</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Bạn có chắc chắn muốn xóa kích thước: <strong>{kichThuocCanXoa?.tenKichThuoc}</strong> này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-2 sm:mt-4">
            <Button
              variant="ghost"
              onClick={() => setMoModalXoa(false)}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <X className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> Hủy
            </Button>
            <Button
              onClick={xoaKichThuoc}
              disabled={isProcessing}
              className="bg-red-500 text-white hover:bg-red-600 text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <FaTrash className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> {isProcessing ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalTrangThai} onOpenChange={setMoModalTrangThai}>
        <DialogContent className="w-full max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Xác nhận thay đổi trạng thái</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Bạn có chắc chắn muốn {kichThuocCanDoiTrangThai?.newStatus === 1 ? "kích hoạt" : "khóa"} kích thước này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-2 sm:mt-4">
            <Button
              variant="ghost"
              onClick={() => setMoModalTrangThai(false)}
              disabled={isProcessing}
              className="bg-[#e7e4f5] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <X className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> Hủy
            </Button>
            <Button
              onClick={changeStatus}
              disabled={isProcessing}
              className="bg-[#9b87f5] text-white hover:bg-[#8a76e3] text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4"
            >
              <FaEdit className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" /> {isProcessing ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSize;