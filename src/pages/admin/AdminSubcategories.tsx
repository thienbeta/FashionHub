import { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaEdit, FaTrashAlt, FaEye, FaUndo, FaTrash } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Search, MoreVertical, Upload, X, Plus, Loader2, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import Swal from "sweetalert2";

// Interface for DanhMucCon data from the backend
interface DanhMucCon {
  maDanhMucCon: number;
  tenDanhMucCon: string;
  maLoaiSanPham?: string;
  trangThai?: number;
}

// Interface for LoaiSanPham data from the backend
interface LoaiSanPham {
  maLoaiSanPham: string;
  tenLoaiSanPham: string;
  kiHieu: string;
  kichThuoc?: string;
  hinhAnh?: string;
  trangThai?: number;
}

// Interface for grouped LoaiSanPham data for combobox
interface GroupedLoaiSanPham {
  id: string;
  tenLoaiSanPham: string;
  trangThai: number;
  entries: LoaiSanPham[];
}

const ITEMS_PER_PAGE = 10;
const API_URL = import.meta.env.VITE_API_URL;

// Main Component
const AdminSubcategories = () => {
  const [danhMucCons, setDanhMucCons] = useState<DanhMucCon[]>([]);
  const [loaiSanPhams, setLoaiSanPhams] = useState<LoaiSanPham[]>([]);
  const [groupedLoaiSanPhams, setGroupedLoaiSanPhams] = useState<GroupedLoaiSanPham[]>([]);
  const [filteredDanhMucCons, setFilteredDanhMucCons] = useState<DanhMucCon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProductTypes, setLoadingProductTypes] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [moModalThem, setMoModalThem] = useState(false);
  const [moModalSua, setMoModalSua] = useState(false);
  const [moModalXoa, setMoModalXoa] = useState(false);
  const [moModalXoaVinhVien, setMoModalXoaVinhVien] = useState(false);
  const [moModalKhoiPhuc, setMoModalKhoiPhuc] = useState(false);
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [danhMucConCanXoa, setDanhMucConCanXoa] = useState<DanhMucCon | null>(null);
  const [danhMucConCanXoaVinhVien, setDanhMucConCanXoaVinhVien] = useState<DanhMucCon | null>(null);
  const [danhMucConCanKhoiPhuc, setDanhMucConCanKhoiPhuc] = useState<DanhMucCon | null>(null);
  const [tenDanhMucConMoi, setTenDanhMucConMoi] = useState("");
  const [maLoaiSanPhamMoi, setMaLoaiSanPhamMoi] = useState("");
  const [danhMucConDangSua, setDanhMucConDangSua] = useState<DanhMucCon | null>(null);
  const [danhMucConChiTiet, setDanhMucConChiTiet] = useState<DanhMucCon | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorsThem, setErrorsThem] = useState({ ten: "", maLoaiSanPham: "" });
  const [errorsSua, setErrorsSua] = useState({ ten: "", maLoaiSanPham: "" });

  const groupLoaiSanPhams = (data: LoaiSanPham[]): GroupedLoaiSanPham[] => {
    const grouped = new Map<string, GroupedLoaiSanPham>();

    data.forEach((lsp) => {
      const parts = lsp.maLoaiSanPham.split('_');
      if (parts.length < 2) return; // Skip invalid MaLoaiSanPham format
      const id = `${parts[0]}_${parts[1]}`; // e.g., "A_00001"

      if (!grouped.has(id)) {
        grouped.set(id, {
          id,
          tenLoaiSanPham: lsp.tenLoaiSanPham,
          trangThai: lsp.trangThai ?? 1,
          entries: [],
        });
      }

      grouped.get(id)!.entries.push(lsp);
    });

    return Array.from(grouped.values()).sort((a, b) => a.tenLoaiSanPham.localeCompare(b.tenLoaiSanPham));
  };

  const fetchDanhMucCon = useCallback(async () => {
    try {
      setLoading(true);
      const targetStatus = activeTab === "active" ? 1 : 0;
      const response = await fetch(`${API_URL}/api/DanhMucCon?trangThai=${targetStatus}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Không tìm thấy dữ liệu danh mục con.");
        } else if (response.status === 500) {
          throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        }
        const errorText = await response.text();
        throw new Error(errorText || "Không thể lấy danh sách danh mục con.");
      }

      const data: DanhMucCon[] = await response.json();
      const sortedData = data.sort((a, b) => b.maDanhMucCon - a.maDanhMucCon);
      setDanhMucCons(sortedData);
      setFilteredDanhMucCons(sortedData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi tải danh sách danh mục con: " + (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchLoaiSanPham = useCallback(async () => {
    try {
      setLoadingProductTypes(true);
      const response = await fetch(`${API_URL}/api/LoaiSanPham`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Không tìm thấy dữ liệu loại sản phẩm.");
        } else if (response.status === 500) {
          throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        }
        const errorText = await response.text();
        throw new Error(errorText || "Không thể lấy danh sách loại sản phẩm.");
      }

      const data: LoaiSanPham[] = await response.json();
      setLoaiSanPhams(data);
      const groupedData = groupLoaiSanPhams(data);
      setGroupedLoaiSanPhams(groupedData);

      // Set default maLoaiSanPhamMoi to the first active LoaiSanPham
      const firstActiveLoaiSanPham = groupedData.find(group => group.trangThai === 1);
      if (firstActiveLoaiSanPham) {
        setMaLoaiSanPhamMoi(firstActiveLoaiSanPham.id);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi tải danh sách loại sản phẩm: " + (error as Error).message,
      });
    } finally {
      setLoadingProductTypes(false);
    }
  }, []);

  const locDanhMucCon = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredDanhMucCons(danhMucCons);
    } else {
      const tuKhoa = searchTerm.toLowerCase();
      const filtered = danhMucCons.filter(
        (dmc) =>
          (dmc.tenDanhMucCon?.toLowerCase().includes(tuKhoa) || false) ||
          (dmc.maLoaiSanPham?.toLowerCase().includes(tuKhoa) || false)
      );
      setFilteredDanhMucCons(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, danhMucCons]);

  useEffect(() => {
    const timer = setTimeout(() => {
      locDanhMucCon();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, locDanhMucCon]);

  useEffect(() => {
    fetchDanhMucCon();
    fetchLoaiSanPham();
  }, [fetchDanhMucCon, fetchLoaiSanPham]); // Added dependencies

  const validateThem = () => {
    let valid = true;
    const newErrors = { ten: "", maLoaiSanPham: "" };

    if (!tenDanhMucConMoi.trim()) {
      newErrors.ten = "Tên danh mục con không được để trống!";
      valid = false;
    } else if (tenDanhMucConMoi.length > 20) {
      newErrors.ten = "Tên danh mục con không được dài quá 20 ký tự!";
      valid = false;
    }

    if (!maLoaiSanPhamMoi || !groupedLoaiSanPhams.some(group => group.id === maLoaiSanPhamMoi)) {
      newErrors.maLoaiSanPham = "Vui lòng chọn một loại sản phẩm hợp lệ!";
      valid = false;
    } else {
      const selectedGroup = groupedLoaiSanPhams.find(group => group.id === maLoaiSanPhamMoi);
      if (selectedGroup && selectedGroup.trangThai !== 1) {
        newErrors.maLoaiSanPham = "Loại sản phẩm này hiện đang không hoạt động!";
        valid = false;
      }
    }

    setErrorsThem(newErrors);
    return valid;
  };

  const validateSua = () => {
    let valid = true;
    const newErrors = { ten: "", maLoaiSanPham: "" };

    if (!danhMucConDangSua?.tenDanhMucCon?.trim()) {
      newErrors.ten = "Tên danh mục con không được để trống!";
      valid = false;
    } else if (danhMucConDangSua.tenDanhMucCon.length > 20) {
      newErrors.ten = "Tên danh mục con không được dài quá 20 ký tự!";
      valid = false;
    }

    if (!danhMucConDangSua?.maLoaiSanPham || !groupedLoaiSanPhams.some(group => group.id === danhMucConDangSua.maLoaiSanPham)) {
      newErrors.maLoaiSanPham = "Vui lòng chọn một loại sản phẩm hợp lệ!";
      valid = false;
    } else {
      const selectedGroup = groupedLoaiSanPhams.find(group => group.id === danhMucConDangSua.maLoaiSanPham);
      if (activeTab === "active" && selectedGroup && selectedGroup.trangThai !== 1) {
        newErrors.maLoaiSanPham = "Loại sản phẩm này hiện đang không hoạt động!";
        valid = false;
      }
    }

    setErrorsSua(newErrors);
    return valid;
  };

  const themDanhMucCon = async () => {
    if (!validateThem()) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/api/DanhMucCon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenDanhMucCon: tenDanhMucConMoi,
          maLoaiSanPham: maLoaiSanPhamMoi,
          trangThai: 1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 400) {
          throw new Error(errorText || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.");
        } else if (response.status === 500) {
          throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        }
        throw new Error(errorText || "Không thể thêm danh mục con.");
      }

      setTenDanhMucConMoi("");
      const firstActiveLoaiSanPham = groupedLoaiSanPhams.find(group => group.trangThai === 1);
      setMaLoaiSanPhamMoi(firstActiveLoaiSanPham ? firstActiveLoaiSanPham.id : "");
      setErrorsThem({ ten: "", maLoaiSanPham: "" });
      setMoModalThem(false);
      await fetchDanhMucCon();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm danh mục con thành công!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi thêm danh mục con: " + (error as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const suaDanhMucCon = async () => {
    if (!validateSua()) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/api/DanhMucCon/${danhMucConDangSua!.maDanhMucCon}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maDanhMucCon: danhMucConDangSua!.maDanhMucCon,
          tenDanhMucCon: danhMucConDangSua!.tenDanhMucCon,
          maLoaiSanPham: danhMucConDangSua!.maLoaiSanPham,
          trangThai: danhMucConDangSua!.trangThai,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 400) {
          throw new Error(errorText || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.");
        } else if (response.status === 404) {
          throw new Error(errorText || "Danh mục con không tồn tại.");
        } else if (response.status === 500) {
          throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        }
        throw new Error(errorText || "Không thể cập nhật danh mục con.");
      }

      setMoModalSua(false);
      setDanhMucConDangSua(null);
      setErrorsSua({ ten: "", maLoaiSanPham: "" });
      await fetchDanhMucCon();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật danh mục con thành công!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi cập nhật danh mục con: " + (error as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const anDanhMucCon = async () => {
    if (!danhMucConCanXoa) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/api/DanhMucCon/SoftDelete/${danhMucConCanXoa.maDanhMucCon}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 400) {
          throw new Error(errorText || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.");
        } else if (response.status === 404) {
          throw new Error(errorText || "Danh mục con không tồn tại.");
        } else if (response.status === 500) {
          throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        }
        throw new Error(errorText || "Không thể ẩn danh mục con.");
      }

      setMoModalXoa(false);
      setDanhMucConCanXoa(null);
      await fetchDanhMucCon();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã ẩn danh mục con!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi ẩn danh mục con: " + (error as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const khoiPhucDanhMucCon = async () => {
    if (!danhMucConCanKhoiPhuc) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/api/DanhMucCon/${danhMucConCanKhoiPhuc.maDanhMucCon}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maDanhMucCon: danhMucConCanKhoiPhuc.maDanhMucCon,
          tenDanhMucCon: danhMucConCanKhoiPhuc.tenDanhMucCon,
          maLoaiSanPham: danhMucConCanKhoiPhuc.maLoaiSanPham,
          trangThai: 1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 400) {
          throw new Error(errorText || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.");
        } else if (response.status === 404) {
          throw new Error(errorText || "Danh mục con không tồn tại.");
        } else if (response.status === 500) {
          throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        }
        throw new Error(errorText || "Không thể khôi phục danh mục con.");
      }

      setMoModalKhoiPhuc(false);
      setDanhMucConCanKhoiPhuc(null);
      await fetchDanhMucCon();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã khôi phục danh mục con!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi khôi phục danh mục con: " + (error as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const xoaVinhVienDanhMucCon = async () => {
    if (!danhMucConCanXoaVinhVien) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/api/DanhMucCon/${danhMucConCanXoaVinhVien.maDanhMucCon}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          throw new Error(errorText || "Danh mục con không tồn tại.");
        } else if (response.status === 409) {
          throw new Error(errorText || "Không thể xóa vì có dữ liệu liên quan.");
        } else if (response.status === 500) {
          throw new Error("Lỗi máy chủ, vui lòng thử lại sau.");
        }
        throw new Error(errorText || "Không thể xóa vĩnh viễn danh mục con.");
      }

      setMoModalXoaVinhVien(false);
      setDanhMucConCanXoaVinhVien(null);
      await fetchDanhMucCon();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã xóa vĩnh viễn danh mục con!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi xóa vĩnh viễn danh mục con: " + (error as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const sortedAndFilteredDanhMucCon = useMemo(() => {
    const filtered = [...danhMucCons]
      .sort((a, b) => b.maDanhMucCon - a.maDanhMucCon)
      .filter(
        (dmc) =>
          (dmc.tenDanhMucCon?.toLowerCase().includes(searchTerm) || false) ||
          (dmc.maLoaiSanPham?.toLowerCase().includes(searchTerm) || false)
      );
    return filtered;
  }, [danhMucCons, searchTerm]);

  const totalPages = Math.ceil(sortedAndFilteredDanhMucCon.length / ITEMS_PER_PAGE);
  const paginatedDanhMucCon = sortedAndFilteredDanhMucCon.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTenLoaiSanPham = (maLoaiSanPham: string | undefined): string => {
    if (!maLoaiSanPham) return "Không xác định";
    const group = groupedLoaiSanPhams.find(group => group.id === maLoaiSanPham);
    return group ? group.tenLoaiSanPham : "Không xác định";
  };

  const getMaLoaiSanPhamFromFullId = (fullMaLoaiSanPham: string | undefined): string | undefined => {
    if (!fullMaLoaiSanPham) return undefined;
    const parts = fullMaLoaiSanPham.split('_');
    if (parts.length < 2) return undefined;
    return `${parts[0]}_${parts[1]}`; // e.g., "A_00001"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Quản Lý Danh Mục Con
        </h1>
        {activeTab === "active" && (
          <Button
            className="bg-[#9b87f5] text-white hover:bg-[#8a76e3]"
            onClick={() => setMoModalThem(true)}
            disabled={loading || loadingProductTypes || isProcessing}
          >
            <FaPlus className="mr-2 h-4 w-4" /> Thêm Danh Mục Con
          </Button>
        )}
      </div>

      <Tabs defaultValue="active" className="w-full" onValueChange={(value) => setActiveTab(value as "active" | "inactive")}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 gap-1">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" /> Danh Sách Danh Mục Con
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" /> Khôi Phục Danh Mục Con
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Tìm kiếm danh mục con..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full md:w-[820px] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {loading || loadingProductTypes ? (
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Danh Sách Danh Mục Con</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>STT</TableHead>
                        <TableHead>Tên Danh Mục Con</TableHead>
                        <TableHead>Loại Sản Phẩm</TableHead>
                        <TableHead>Hành Động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDanhMucCon.length > 0 ? (
                        paginatedDanhMucCon.map((dmc, index) => {
                          const isLoaiSanPhamKhongXacDinh = getTenLoaiSanPham(dmc.maLoaiSanPham) === "Không xác định";
                          return (
                            <TableRow key={dmc.maDanhMucCon} className="hover:bg-muted/50">
                              <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                              <TableCell>{dmc.tenDanhMucCon}</TableCell>
                              <TableCell>{getTenLoaiSanPham(dmc.maLoaiSanPham)}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setDanhMucConChiTiet(dmc);
                                        setMoModalChiTiet(true);
                                      }}
                                      className="text-green-700"
                                    >
                                      <FaEye className="mr-2 h-4 w-4" /> Xem
                                    </DropdownMenuItem>
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setDanhMucConDangSua(dmc);
                                          setMoModalSua(true);
                                        }}
                                        className="text-blue-700"
                                      >
                                        <FaEdit className="mr-2 h-4 w-4" /> Sửa
                                      </DropdownMenuItem>
                                      {isLoaiSanPhamKhongXacDinh ? (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setDanhMucConCanXoaVinhVien(dmc);
                                            setMoModalXoaVinhVien(true);
                                          }}
                                          className="text-red-700"
                                        >
                                          <FaTrash className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setDanhMucConCanXoa(dmc);
                                            setMoModalXoa(true);
                                          }}
                                          className="text-red-700"
                                        >
                                          <FaTrashAlt className="mr-2 h-4 w-4" /> Ẩn
                                        </DropdownMenuItem>
                                      )}
                                    </>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            Không tìm thấy danh mục con nào.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Trước
                  </Button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      className={currentPage === page ? "bg-[#9b87f5] text-white hover:bg-[#8a76e3]" : ""}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="flex items-center"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="inactive">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Tìm kiếm danh mục con..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full md:w-[820px] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {loading || loadingProductTypes ? (
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Danh Sách Danh Mục Con Đã Ẩn</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>STT</TableHead>
                        <TableHead>Tên Danh Mục Con</TableHead>
                        <TableHead>Loại Sản Phẩm</TableHead>
                        <TableHead>Hành Động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDanhMucCon.length > 0 ? (
                        paginatedDanhMucCon.map((dmc, index) => (
                          <TableRow key={dmc.maDanhMucCon} className="hover:bg-muted/50">
                            <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                            <TableCell>{dmc.tenDanhMucCon}</TableCell>
                            <TableCell>{getTenLoaiSanPham(dmc.maLoaiSanPham)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDanhMucConChiTiet(dmc);
                                      setMoModalChiTiet(true);
                                    }}
                                    className="text-green-700"
                                  >
                                    <FaEye className="mr-2 h-4 w-4" /> Chi tiết
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDanhMucConCanKhoiPhuc(dmc);
                                      setMoModalKhoiPhuc(true);
                                    }}
                                    className="text-blue-700"
                                  >
                                    <FaUndo className="mr-2 h-4 w-4" /> Khôi phục
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDanhMucConCanXoaVinhVien(dmc);
                                      setMoModalXoaVinhVien(true);
                                    }}
                                    className="text-red-700"
                                  >
                                    <FaTrash className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            Không có danh mục con nào để khôi phục.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Trước
                  </Button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      className={currentPage === page ? "bg-[#9b87f5] text-white hover:bg-[#8a76e3]" : ""}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="flex items-center"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={moModalThem} onOpenChange={setMoModalThem}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Thêm Danh Mục Con</DialogTitle>
            <DialogDescription>Nhập thông tin danh mục con mới.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên Danh Mục Con</label>
              <Input
                value={tenDanhMucConMoi}
                onChange={(e) => {
                  setTenDanhMucConMoi(e.target.value);
                  setErrorsThem((prev) => ({ ...prev, ten: "" }));
                }}
                placeholder="Tên danh mục con"
                maxLength={20}
                disabled={isProcessing || loadingProductTypes}
              />
              {errorsThem.ten && <p className="text-red-500 text-sm mt-1">{errorsThem.ten}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại Sản Phẩm</label>
              <Select
                value={maLoaiSanPhamMoi}
                onValueChange={(value) => {
                  setMaLoaiSanPhamMoi(value);
                  setErrorsThem((prev) => ({ ...prev, maLoaiSanPham: "" }));
                }}
                disabled={isProcessing || loadingProductTypes}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {groupedLoaiSanPhams
                    .filter(group => group.trangThai === 1)
                    .map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.tenLoaiSanPham}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errorsThem.maLoaiSanPham && <p className="text-red-500 text-sm mt-1">{errorsThem.maLoaiSanPham}</p>}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setMoModalThem(false)} disabled={isProcessing || loadingProductTypes} className="flex items-center gap-2 bg-[#e7e4f5]">
              <X className="h-4 w-4" /> Hủy
            </Button>
            <Button onClick={themDanhMucCon} disabled={isProcessing || loadingProductTypes} className="bg-[#9b87f5] text-white hover:bg-[#8a76e3] flex items-center gap-2">
              {isProcessing ? "Đang xử lý..." : "Thêm"}
              <Plus className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalSua} onOpenChange={setMoModalSua}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Sửa Danh Mục Con</DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục con.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên Danh Mục Con</label>
              <Input
                value={danhMucConDangSua?.tenDanhMucCon || ""}
                onChange={(e) => {
                  setDanhMucConDangSua({ ...danhMucConDangSua!, tenDanhMucCon: e.target.value });
                  setErrorsSua((prev) => ({ ...prev, ten: "" }));
                }}
                placeholder="Tên danh mục con"
                maxLength={20}
                disabled={isProcessing || loadingProductTypes}
              />
              {errorsSua.ten && <p className="text-red-500 text-sm mt-1">{errorsSua.ten}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại Sản Phẩm</label>
              <Select
                value={danhMucConDangSua?.maLoaiSanPham}
                onValueChange={(value) => {
                  setDanhMucConDangSua({ ...danhMucConDangSua!, maLoaiSanPham: value });
                  setErrorsSua((prev) => ({ ...prev, maLoaiSanPham: "" }));
                }}
                disabled={isProcessing || loadingProductTypes}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {groupedLoaiSanPhams
                    .filter(group => activeTab === "active" ? group.trangThai === 1 : true)
                    .map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.tenLoaiSanPham} {group.trangThai !== 1 ? "(Không hoạt động)" : ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errorsSua.maLoaiSanPham && <p className="text-red-500 text-sm mt-1">{errorsSua.maLoaiSanPham}</p>}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setMoModalSua(false)} disabled={isProcessing || loadingProductTypes} className="flex items-center gap-2 bg-[#e7e4f5]">
              <X className="h-4 w-4" /> Hủy
            </Button>
            <Button onClick={suaDanhMucCon} disabled={isProcessing || loadingProductTypes} className="bg-[#9b87f5] text-white hover:bg-[#8a76e3] flex items-center gap-2">
              {isProcessing ? "Đang xử lý..." : "Lưu"}
              <FaEdit className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalChiTiet} onOpenChange={setMoModalChiTiet}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Chi Tiết Danh Mục Con</DialogTitle>
            <DialogDescription>Thông tin chi tiết của danh mục con.</DialogDescription>
          </DialogHeader>
          {danhMucConChiTiet && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên Danh Mục Con</label>
                <Input value={danhMucConChiTiet.tenDanhMucCon} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại Sản Phẩm</label>
                <Input value={getTenLoaiSanPham(danhMucConChiTiet.maLoaiSanPham)} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
                <Input value={danhMucConChiTiet.trangThai === 1 ? "Hoạt động" : "Không hoạt động"} disabled />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setMoModalChiTiet(false)} disabled={isProcessing} className="flex items-center gap-2 bg-[#e7e4f5]">
              <X className="h-4 w-4" /> Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalXoa} onOpenChange={setMoModalXoa}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận ẩn danh mục con</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn ẩn danh mục con này không? Bạn có thể khôi phục lại sau.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setMoModalXoa(false)} disabled={isProcessing} className="flex items-center gap-2 bg-[#e7e4f5]">
              <X className="h-4 w-4" /> Hủy
            </Button>
            <Button onClick={anDanhMucCon} disabled={isProcessing} className="bg-[#9b87f5] text-white hover:bg-[#8a76e3] flex items-center gap-2">
              {isProcessing ? "Đang xử lý..." : "Ẩn"}
              <FaTrashAlt className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalKhoiPhuc} onOpenChange={setMoModalKhoiPhuc}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận khôi phục danh mục con</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn khôi phục danh mục con này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setMoModalKhoiPhuc(false)} disabled={isProcessing} className="flex items-center gap-2 bg-[#e7e4f5]">
              <X className="h-4 w-4" /> Hủy
            </Button>
            <Button onClick={khoiPhucDanhMucCon} disabled={isProcessing} className="bg-[#9b87f5] text-white hover:bg-[#8a76e3] flex items-center gap-2">
              {isProcessing ? "Đang xử lý..." : "Khôi phục"}
              <FaUndo className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moModalXoaVinhVien} onOpenChange={setMoModalXoaVinhVien}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa vĩnh viễn danh mục con</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa vĩnh viễn danh mục con này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setMoModalXoaVinhVien(false)} disabled={isProcessing} className="flex items-center gap-2 bg-[#e7e4f5]">
              <X className="h-4 w-4" /> Hủy
            </Button>
            <Button onClick={xoaVinhVienDanhMucCon} disabled={isProcessing} className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2">
              {isProcessing ? "Đang xử lý..." : "Xóa vĩnh viễn"}
              <FaTrash className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubcategories;