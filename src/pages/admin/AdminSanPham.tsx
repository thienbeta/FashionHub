import { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/pages/ui/dialog";
import { Search, MoreVertical, Download, ChevronLeft, ChevronRight, Loader2, ChevronDown, X } from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import ThemSanPham from "@/pages/sanpham/ThemSanPham";
import SuaSanPham from "@/pages/sanpham/SuaSanPham";
import ChiTietSanPham from "@/pages/sanpham/ChiTietSanPham";

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
  medias: {
    maMedia: number;
    loaiMedia: string;
    duongDan: string;
    altMedia: string | null;
    linkMedia: string | null;
    ngayTao: string;
    trangThai: number;
    maSanPham: number;
    tenSanPham: string;
  }[];
  videos: string[];
}

interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
  loaiDanhMuc: number;
  trangThai: number;
}

interface BienThe {
  maBienThe: number;
  maSanPham: number;
  giaBan: number;
  giaNhap: number | null;
  soLuongNhap: number;
  maMau: number;
  tenMau: string | null;
  maKichThuoc: number;
  tenKichThuoc: string | null;
  maVach: string | null;
  khuyenMai: number | null;
  hinhAnh: string | null;
  trangThai: number;
  ngayTao: string;
}

interface ThemSanPhamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  danhMucList: DanhMuc[];
  fetchSanPham: () => Promise<void>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  mauList: DanhMuc[];
  kichThuocList: DanhMuc[];
}

interface SuaSanPhamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sanPhamDangSua: SanPham | null;
  setSanPhamDangSua: React.Dispatch<React.SetStateAction<SanPham | null>>;
  danhMucList: DanhMuc[];
  fetchSanPham: () => Promise<void>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  mauList: DanhMuc[];
  kichThuocList: DanhMuc[];
}

interface ChiTietSanPhamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sanPhamChiTiet: SanPham | null;
  bienTheList: BienThe[];
  isProcessing: boolean;
}

const ITEMS_PER_PAGE = 10;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";
const TITLE = import.meta.env.VITE_TITLE || "Fashion";

const AdminSanPham: React.FC = () => {
  const [sanPhamList, setSanPhamList] = useState<SanPham[]>([]);
  const [filteredSanPhamList, setFilteredSanPhamList] = useState<SanPham[]>([]);
  const [danhMucList, setDanhMucList] = useState<DanhMuc[]>([]);
  const [bienTheList, setBienTheList] = useState<BienThe[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loaiFilter, setLoaiFilter] = useState<string>("all");
  const [thuongHieuFilter, setThuongHieuFilter] = useState<string>("all");
  const [hashtagFilter, setHashtagFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [moModalThem, setMoModalThem] = useState(false);
  const [moModalSua, setMoModalSua] = useState(false);
  const [moModalXoa, setMoModalXoa] = useState(false);
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [moModalDoiTrangThai, setMoModalDoiTrangThai] = useState(false);
  const [sanPhamCanXoa, setSanPhamCanXoa] = useState<SanPham | null>(null);
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState<SanPham | null>(null);
  const [sanPhamDangSua, setSanPhamDangSua] = useState<SanPham | null>(null);
  const [sanPhamDoiTrangThai, setSanPhamDoiTrangThai] = useState<SanPham | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const mauList = useMemo(() => danhMucList.filter(dm => dm.loaiDanhMuc === 5), [danhMucList]);
  const kichThuocList = useMemo(() => danhMucList.filter(dm => dm.loaiDanhMuc === 4), [danhMucList]);
  const loaiList = useMemo(() => danhMucList.filter(dm => dm.loaiDanhMuc === 1), [danhMucList]);
  const thuongHieuList = useMemo(() => danhMucList.filter(dm => dm.loaiDanhMuc === 2), [danhMucList]);
  const hashtagList = useMemo(() => danhMucList.filter(dm => dm.loaiDanhMuc === 3), [danhMucList]);

  const fetchSanPham = useCallback(async () => {
    setLoading(true);
    try {
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
      data.sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime());
      setSanPhamList(data);
      setFilteredSanPhamList(data);
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

  const fetchDanhMuc = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/DanhMuc`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Không thể lấy danh sách danh mục.");
      const data: DanhMuc[] = await response.json();
      setDanhMucList(data.filter(dm => dm.trangThai === 1));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi tải danh mục: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  }, []);

  const fetchBienThe = useCallback(async (maSanPham: number) => {
    try {
      const response = await fetch(`${API_URL}/api/BienThe/by-san-pham/${maSanPham}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Không thể lấy danh sách biến thể.");
      const data: BienThe[] = await response.json();
      setBienTheList(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi tải biến thể: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  }, []);

  const doiTrangThaiSanPham = async () => {
    if (!sanPhamDoiTrangThai) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/SanPham/${sanPhamDoiTrangThai.maSanPham}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maSanPham: sanPhamDoiTrangThai.maSanPham,
          tenSanPham: sanPhamDoiTrangThai.tenSanPham,
          moTa: sanPhamDoiTrangThai.moTa,
          slug: sanPhamDoiTrangThai.slug,
          chatLieu: sanPhamDoiTrangThai.chatLieu,
          gioiTinh: sanPhamDoiTrangThai.gioiTinh,
          maLoai: sanPhamDoiTrangThai.maLoai,
          maThuongHieu: sanPhamDoiTrangThai.maThuongHieu,
          maHashtag: sanPhamDoiTrangThai.maHashtag,
          trangThai: sanPhamDoiTrangThai.trangThai === 1 ? 0 : 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Không thể đổi trạng thái sản phẩm.");
      }

      setMoModalDoiTrangThai(false);
      setSanPhamDoiTrangThai(null);
      await fetchSanPham();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã đổi trạng thái sản phẩm thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi đổi trạng thái sản phẩm: ${(error as Error).message}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const xoaSanPham = async () => {
    if (!sanPhamCanXoa) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/SanPham/${sanPhamCanXoa.maSanPham}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Không thể xóa sản phẩm.");
      }

      setMoModalXoa(false);
      setSanPhamCanXoa(null);
      setCurrentPage(1);
      await fetchSanPham();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã xóa sản phẩm thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi xóa sản phẩm: ${(error as Error).message}`,
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

  const totalPages = Math.ceil(filteredSanPhamList.length / ITEMS_PER_PAGE);
  const paginatedSanPhamList = useMemo(() => {
    return filteredSanPhamList.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredSanPhamList, currentPage]);

  const exportToExcel = () => {
    const data = filteredSanPhamList.map((sanPham, index) => ({
      STT: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
      "Mã Sản Phẩm": sanPham.maSanPham,
      "Tên Sản Phẩm": sanPham.tenSanPham,
      "Mô Tả": sanPham.moTa || "",
      "Loại Sản Phẩm": sanPham.tenLoai || "",
      "Thương Hiệu": sanPham.tenThuongHieu || "",
      "Hashtag": sanPham.tenHashtag || "",
      "Trạng Thái": sanPham.trangThai === 1 ? "Kích hoạt" : "Vô hiệu hóa",
      "Ngày Tạo": new Date(sanPham.ngayTao).toLocaleDateString("vi-VN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const date = new Date().toLocaleDateString("vi-VN").replace(/\//g, "-");
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách sản phẩm");
    XLSX.writeFile(workbook, `DanhSachSanPham_${date}.xlsx`);
  };

  useEffect(() => {
    fetchSanPham();
    fetchDanhMuc();
  }, [fetchSanPham, fetchDanhMuc]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      let filtered = [...sanPhamList];

      if (searchTerm || loaiFilter !== "all" || thuongHieuFilter !== "all" || hashtagFilter !== "all") {
        try {
          const queryParams = new URLSearchParams();
          if (searchTerm) queryParams.append("ten", encodeURIComponent(searchTerm));
          if (loaiFilter !== "all") queryParams.append("maLoai", loaiFilter);
          if (thuongHieuFilter !== "all") queryParams.append("maThuongHieu", thuongHieuFilter);
          if (hashtagFilter !== "all") queryParams.append("maHashtag", hashtagFilter);

          const response = await fetch(`${API_URL}/api/SanPham/search?${queryParams.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            filtered = await response.json();
          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Không thể tìm kiếm sản phẩm.",
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

      setFilteredSanPhamList(filtered);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, loaiFilter, thuongHieuFilter, hashtagFilter, sanPhamList]);

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
          Quản Lý Sản Phẩm - {TITLE}
        </h1>
        <Button
          className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white text-sm sm:text-base py-2 px-4 rounded-md transition-colors"
          onClick={() => setMoModalThem(true)}
          disabled={loading || isProcessing}
        >
          <FaPlus className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            disabled={isProcessing}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={loaiFilter}
            onChange={(e) => setLoaiFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm appearance-none"
            disabled={isProcessing}
          >
            <option value="all">Tất cả loại sản phẩm</option>
            {loaiList.map(dm => (
              <option key={dm.maDanhMuc} value={dm.maDanhMuc}>{dm.tenDanhMuc}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={thuongHieuFilter}
            onChange={(e) => setThuongHieuFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm appearance-none"
            disabled={isProcessing}
          >
            <option value="all">Tất cả thương hiệu</option>
            {thuongHieuList.map(dm => (
              <option key={dm.maDanhMuc} value={dm.maDanhMuc}>{dm.tenDanhMuc}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={hashtagFilter}
            onChange={(e) => setHashtagFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm appearance-none"
            disabled={isProcessing}
          >
            <option value="all">Tất cả hashtag</option>
            {hashtagList.map(dm => (
              <option key={dm.maDanhMuc} value={dm.maDanhMuc}>{dm.tenDanhMuc}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
        <Button
          className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white text-sm sm:text-base py-2 px-4 rounded-md transition-colors"
          onClick={exportToExcel}
          disabled={loading || isProcessing || filteredSanPhamList.length === 0}
        >
          <Download className="mr-2 h-4 w-4" /> Xuất Excel
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>
      ) : (
        <>
          <Card className="overflow-x-auto bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-gray-800">Danh sách sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="text-sm sm:text-base">STT</TableHead>
                    <TableHead className="text-sm sm:text-base">Hình Ảnh</TableHead>
                    <TableHead className="text-sm sm:text-base">Tên Sản Phẩm</TableHead>
                    <TableHead className="text-sm sm:text-base">Loại</TableHead>
                    <TableHead className="text-sm sm:text-base">Thương Hiệu</TableHead>
                    <TableHead className="text-sm sm:text-base">Trạng Thái</TableHead>
                    <TableHead className="text-sm sm:text-base">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSanPhamList.length > 0 ? (
                    paginatedSanPhamList.map((sanPham, index) => {
                      const firstImage = sanPham.medias?.find(
                        media => media.loaiMedia === "image" && media.trangThai === 1
                      );
                      return (
                        <TableRow key={sanPham.maSanPham} className="hover:bg-gray-50">
                          <TableCell className="text-sm sm:text-base">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </TableCell>
                          <TableCell className="text-sm sm:text-base">
                            {firstImage ? (
                              <img
                                src={`${API_URL}${firstImage.duongDan}`}
                                alt={firstImage.altMedia || sanPham.tenSanPham}
                                className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded cursor-pointer"
                                onClick={() => {
                                  setSanPhamChiTiet(sanPham);
                                  fetchBienThe(sanPham.maSanPham);
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
                          <TableCell className="text-sm sm:text-base">{sanPham.tenSanPham}</TableCell>
                          <TableCell className="text-sm sm:text-base">{sanPham.tenLoai || "N/A"}</TableCell>
                          <TableCell className="text-sm sm:text-base">{sanPham.tenThuongHieu || "N/A"}</TableCell>
                          <TableCell className="text-sm sm:text-base">
                            <label className="relative inline-block w-14 h-7">
                              <input
                                type="checkbox"
                                className="opacity-0 w-0 h-0"
                                checked={sanPham.trangThai === 1}
                                onChange={() => {
                                  setSanPhamDoiTrangThai({ ...sanPham });
                                  setMoModalDoiTrangThai(true);
                                }}
                                disabled={isProcessing}
                              />
                              <span
                                className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                                  before:absolute before:h-6 before:w-6 before:left-0.5 before:bottom-0.5
                                  before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                                  ${sanPham.trangThai === 1
                                    ? "bg-indigo-500 before:translate-x-7"
                                    : "bg-gray-400"
                                  } hover:scale-105 shadow-sm hover:shadow-md`}
                              ></span>
                              <span className="sr-only">
                                {sanPham.trangThai === 1 ? "Kích hoạt" : "Vô hiệu hóa"}
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
                                    setSanPhamChiTiet(sanPham);
                                    fetchBienThe(sanPham.maSanPham);
                                    setMoModalChiTiet(true);
                                  }}
                                  className="text-green-700 text-sm"
                                >
                                  <FaEye className="mr-2 h-4 w-4" /> Xem
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSanPhamDangSua(sanPham);
                                    setMoModalSua(true);
                                  }}
                                  className="text-blue-700 text-sm"
                                >
                                  <FaEdit className="mr-2 h-4 w-4" /> Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSanPhamCanXoa(sanPham);
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
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-sm sm:text-base text-gray-500">
                        Không tìm thấy sản phẩm nào.
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
                  className={`text-sm py-2 px-3 w-12 h-12 rounded-md ${currentPage === page ? "bg-indigo-500 text-white hover:bg-indigo-600" : "border-gray-300 hover:bg-gray-100"}`}
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

      <ThemSanPham
        open={moModalThem}
        onOpenChange={setMoModalThem}
        danhMucList={danhMucList}
        fetchSanPham={fetchSanPham}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        mauList={mauList}
        kichThuocList={kichThuocList}
      />

      <SuaSanPham
        open={moModalSua}
        onOpenChange={(open) => {
          setMoModalSua(open);
          if (!open) setSanPhamDangSua(null);
        }}
        sanPhamDangSua={sanPhamDangSua}
        setSanPhamDangSua={setSanPhamDangSua}
        danhMucList={danhMucList}
        fetchSanPham={fetchSanPham}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        mauList={mauList}
        kichThuocList={kichThuocList}
      />

      <ChiTietSanPham
        open={moModalChiTiet}
        onOpenChange={(open) => {
          setMoModalChiTiet(open);
          if (!open) setSanPhamChiTiet(null);
        }}
        sanPhamChiTiet={sanPhamChiTiet}
        bienTheList={bienTheList}
        isProcessing={isProcessing}
      />

      <Dialog open={moModalXoa} onOpenChange={(open) => {
        setMoModalXoa(open);
        if (!open) setSanPhamCanXoa(null);
      }}>
        <DialogContent className="w-full max-w-md sm:max-w-lg bg-white rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-gray-800">Xác nhận xóa sản phẩm</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600">
              Bạn có chắc chắn muốn xóa sản phẩm: <strong>{sanPhamCanXoa?.tenSanPham}</strong> không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setMoModalXoa(false)}
              disabled={isProcessing}
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm py-2 px-4 rounded-md"
            >
              <X className="h-4 w-4 mr-2" /> Hủy
            </Button>
            <Button
              onClick={xoaSanPham}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-md"
            >
              <FaTrash className="h-4 w-4 mr-2" /> {isProcessing ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalDoiTrangThai} onOpenChange={(open) => {
        setMoModalDoiTrangThai(open);
        if (!open) setSanPhamDoiTrangThai(null);
      }}>
        <DialogContent className="w-full max-w-md sm:max-w-lg bg-white rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-gray-800">Xác nhận đổi trạng thái sản phẩm</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600">
              Bạn có chắc chắn muốn đổi trạng thái sản phẩm: <strong>{sanPhamDoiTrangThai?.tenSanPham}</strong> sang{" "}
              <strong>{sanPhamDoiTrangThai?.trangThai === 1 ? "Vô hiệu hóa" : "Kích hoạt"}</strong> không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setMoModalDoiTrangThai(false)}
              disabled={isProcessing}
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm py-2 px-4 rounded-md"
            >
              <X className="h-4 w-4 mr-2" /> Hủy
            </Button>
            <Button
              onClick={doiTrangThaiSanPham}
              disabled={isProcessing}
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2 px-4 rounded-md"
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSanPham;