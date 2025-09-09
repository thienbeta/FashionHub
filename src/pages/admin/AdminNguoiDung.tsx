import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import {
  Search,
  User,
  BarChart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MoreVertical,
  Eye,
  Edit,
  Trash,
  X,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/pages/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/pages/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/pages/ui/tabs";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import Swal from "sweetalert2";

import ThemNguoiDung from "@/pages/nguoidung/ThemNguoiDung";
import ChiTietNguoiDung from "@/pages/nguoidung/ChiTietNguoiDung";
import SuaNguoiDung from "@/pages/nguoidung/SuaNguoiDung";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface Account {
  maNguoiDung: number;
  hoTen: string;
  email: string;
  taiKhoan: string;
  matKhau?: string;
  sdt?: string;
  cccd?: string;
  diaChi?: string;
  vaiTro: number;
  trangThai: number;
  ngayTao: string;
  ngaySinh?: string;
  timeKhoa?: string | null;
  avt?: string;
  tieuSu?: string;
  gioiTinh?: number;
}

const API_URL = "http://localhost:5083";

const AdminNguoiDung = () => {
  const [users, setUsers] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("danhSachTaiKhoan");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "hide" | "restore" | "delete" | null
  >(null);
  const [confirmationUser, setConfirmationUser] = useState<Account | null>(null);
  const [selectedUser, setSelectedUser] = useState<Account | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateChiTietModalOpen, setUpdateChiTietModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lockedUsers: 0,
    usersToday: 0,
    usersThisMonth: 0,
    usersThisYear: 0,
  });
  const [roleData, setRoleData] = useState({
    admin: 0,
    nhanvien: 0,
    nguoidung: 0,
  });
  const [statusData, setStatusData] = useState({ active: 0, locked: 0 });
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0));
  const pageSize = 10;

  const roleChartData = {
    labels: ["Admin", "Nhân viên", "Người dùng"],
    datasets: [
      {
        label: "Số lượng",
        data: [roleData.admin, roleData.nhanvien, roleData.nguoidung],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const statusChartData = {
    labels: ["Hoạt động", "Khóa"],
    datasets: [
      {
        data: [statusData.active, statusData.locked],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const monthlyChartData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Người dùng mới",
        data: monthlyData,
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.1,
      },
    ],
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/NguoiDung`, {
        headers: { accept: "*/*" },
      });
      if (!response.ok) throw new Error("Lỗi khi tải danh sách người dùng");
      const data: Account[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const calculateStats = useCallback(() => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    let activeUsers = 0;
    let lockedUsers = 0;
    let usersToday = 0;
    let usersThisMonth = 0;
    let usersThisYear = 0;

    users.forEach((user) => {
      if (user.trangThai === 1) activeUsers++;
      else if (user.trangThai === 0) lockedUsers++;

      const creationDate = new Date(user.ngayTao);
      if (creationDate >= startOfDay) usersToday++;
      if (creationDate >= startOfMonth) usersThisMonth++;
      if (creationDate >= startOfYear) usersThisYear++;
    });

    setStats({
      totalUsers: users.length,
      activeUsers,
      lockedUsers,
      usersToday,
      usersThisMonth,
      usersThisYear,
    });
  }, [users]);

  const calculateRoleData = useCallback(() => {
    const roleCounts = { admin: 0, nhanvien: 0, nguoidung: 0 };
    users.forEach((user) => {
      if (user.vaiTro === 1) roleCounts.admin++;
      else if (user.vaiTro === 2) roleCounts.nhanvien++;
      else roleCounts.nguoidung++;
    });
    setRoleData(roleCounts);
  }, [users]);

  const calculateStatusData = useCallback(() => {
    const statusCounts = { active: 0, locked: 0 };
    users.forEach((user) => {
      if (user.trangThai === 1) statusCounts.active++;
      else if (user.trangThai === 0) statusCounts.locked++;
    });
    setStatusData(statusCounts);
  }, [users]);

  const calculateMonthlyData = useCallback(() => {
    const monthlyCounts = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    users.forEach((user) => {
      const creationDate = new Date(user.ngayTao);
      if (creationDate.getFullYear() === currentYear) {
        const month = creationDate.getMonth();
        monthlyCounts[month]++;
      }
    });
    setMonthlyData(monthlyCounts);
  }, [users]);

  useEffect(() => {
    calculateStats();
    calculateRoleData();
    calculateStatusData();
    calculateMonthlyData();
  }, [users, calculateStats, calculateRoleData, calculateStatusData, calculateMonthlyData]);

  const getRoleString = (vaiTro: number) => {
    if (vaiTro === 1) return "admin";
    if (vaiTro === 2) return "nhanvien";
    return "nguoidung";
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      user.hoTen?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.taiKhoan?.toLowerCase().includes(searchLower);
    const matchesRole =
      roleFilter === "all" || getRoleString(user.vaiTro) === roleFilter;

    if (activeTab === "danhSachTaiKhoan") {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.trangThai === 1) ||
        (statusFilter === "locked" && user.trangThai === 0);
      return matchesSearch && matchesRole && matchesStatus && (user.trangThai === 0 || user.trangThai === 1);
    } else if (activeTab === "khoiPhuc") {
      return matchesSearch && matchesRole && user.trangThai === 2;
    }
    return false;
  });

  const sortedUsers = filteredUsers.sort(
    (a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime()
  );

  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/NguoiDung/search?keyword=${encodeURIComponent(searchQuery)}`, {
        headers: { accept: "*/*" },
      });
      if (!response.ok) throw new Error("Lỗi khi tìm kiếm người dùng");
      const data: Account[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const performAction = async () => {
    if (!confirmationUser) return;
    try {
      if (confirmationAction === "hide") {
        const formData = new FormData();
        formData.append("MaNguoiDung", confirmationUser.maNguoiDung.toString());
        formData.append("HoTen", confirmationUser.hoTen);
        formData.append("Email", confirmationUser.email);
        formData.append("TaiKhoan", confirmationUser.taiKhoan);
        formData.append("VaiTro", confirmationUser.vaiTro.toString());
        formData.append("TrangThai", "2");
        if (confirmationUser.sdt) formData.append("Sdt", confirmationUser.sdt);
        if (confirmationUser.cccd) formData.append("Cccd", confirmationUser.cccd);
        if (confirmationUser.diaChi) formData.append("DiaChi", confirmationUser.diaChi);
        if (confirmationUser.tieuSu) formData.append("TieuSu", confirmationUser.tieuSu);
        if (confirmationUser.gioiTinh !== undefined) formData.append("GioiTinh", confirmationUser.gioiTinh.toString());
        if (confirmationUser.timeKhoa) formData.append("TimeKhoa", confirmationUser.timeKhoa);

        await fetch(`${API_URL}/api/NguoiDung/${confirmationUser.maNguoiDung}`, {
          method: "PUT",
          body: formData,
        });
      } else if (confirmationAction === "restore") {
        const formData = new FormData();
        formData.append("MaNguoiDung", confirmationUser.maNguoiDung.toString());
        formData.append("HoTen", confirmationUser.hoTen);
        formData.append("Email", confirmationUser.email);
        formData.append("TaiKhoan", confirmationUser.taiKhoan);
        formData.append("VaiTro", confirmationUser.vaiTro.toString());
        formData.append("TrangThai", "1");
        if (confirmationUser.sdt) formData.append("Sdt", confirmationUser.sdt);
        if (confirmationUser.cccd) formData.append("Cccd", confirmationUser.cccd);
        if (confirmationUser.diaChi) formData.append("DiaChi", confirmationUser.diaChi);
        if (confirmationUser.tieuSu) formData.append("TieuSu", confirmationUser.tieuSu);
        if (confirmationUser.gioiTinh !== undefined) formData.append("GioiTinh", confirmationUser.gioiTinh.toString());

        await fetch(`${API_URL}/api/NguoiDung/${confirmationUser.maNguoiDung}`, {
          method: "PUT",
          body: formData,
        });
      } else if (confirmationAction === "delete") {
        await fetch(`${API_URL}/api/NguoiDung/${confirmationUser.maNguoiDung}`, {
          method: "DELETE",
        });
      }
      await fetchUsers();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: `Đã ${confirmationAction === "hide" ? "xóa" : confirmationAction === "restore" ? "khôi phục" : "xóa vĩnh viễn"} người dùng thành công`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: (err as Error).message,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setConfirmationOpen(false);
      setConfirmationUser(null);
      setConfirmationAction(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          Quản Lý Người Dùng
        </h1>
        <ThemNguoiDung fetchUsers={fetchUsers} />
      </div>

      <Tabs defaultValue="danhSachTaiKhoan" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-3 gap-1">
          <TabsTrigger value="danhSachTaiKhoan" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Danh sách tài khoản
          </TabsTrigger>
          <TabsTrigger value="khoiPhuc" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Khôi phục
          </TabsTrigger>
          <TabsTrigger value="danhSachThongKe" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Danh sách thống kê
          </TabsTrigger>
        </TabsList>

        <TabsContent value="danhSachTaiKhoan">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                className="pl-8 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchUsers();
                  }}
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border rounded-md p-2 pl-8"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="nhanvien">Nhân viên</option>
                <option value="nguoidung">Người dùng</option>
              </select>
            </div>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md p-2 pl-8"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Khóa</option>
              </select>
            </div>
          </div>

          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead className="w-[120px]">Hình Ảnh</TableHead>
                  <TableHead>Họ Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tài Khoản</TableHead>
                  <TableHead>Vai Trò</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="w-[120px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <TableRow key={user.maNguoiDung} className="hover:bg-muted/50">
                      <TableCell align="center">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                      <TableCell align="center">
                        <img
                          src={
                            user.avt
                              ? user.avt.startsWith("/Uploads")
                                ? `${API_URL}${user.avt}`
                                : user.avt
                              : "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp"
                          }
                          alt="Avatar"
                          className="w-16 h-16 rounded-full mx-auto mt-4 object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedUser(user);
                            setViewModalOpen(true);
                          }}
                        />
                      </TableCell>
                      <TableCell>{user.hoTen}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.taiKhoan || ""}</TableCell>
                      <TableCell>
                        {user.vaiTro === 1 ? "Admin" : user.vaiTro === 2 ? "Nhân viên" : "Người dùng"}
                      </TableCell>
                      <TableCell>
                        <label className="relative inline-block w-[60px] h-[34px]">
                          <input
                            type="checkbox"
                            className="opacity-0 w-0 h-0"
                            checked={user.trangThai === 1}
                            onChange={(e) => {
                              setSelectedUser(user);
                              setConfirmationAction("hide");
                              setConfirmationOpen(true);
                            }}
                            disabled={confirmationOpen}
                          />
                          <span
                            className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                              before:absolute before:h-[30px] before:w-[30px] before:left-[2px] before:bottom-[2px]
                              before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                              ${
                                user.trangThai === 1
                                  ? "bg-crocus-500 before:translate-x-[26px]"
                                  : "bg-gray-400"
                              } hover:scale-110 shadow-sm hover:shadow-md`}
                          ></span>
                          <span className="sr-only">
                            {user.trangThai === 1 ? "Hoạt động" : "Khóa"}
                          </span>
                        </label>
                      </TableCell>
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setViewModalOpen(true);
                              }}
                              className="text-green-700"
                            >
                              <Eye className="mr-2 h-4 w-4" /> Xem
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setUpdateChiTietModalOpen(true);
                              }}
                              className="text-blue-700"
                            >
                              <Edit className="mr-2 h-4 w-4" /> Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setConfirmationUser(user);
                                setConfirmationAction("hide");
                                setConfirmationOpen(true);
                              }}
                              className="text-red-700"
                            >
                              <Trash className="mr-2 h-4 w-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      Không tìm thấy người dùng nào phù hợp với tìm kiếm của bạn.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {currentUsers.map((user) => (
              <Card key={user.maNguoiDung}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          user.avt
                            ? user.avt.startsWith("/Uploads")
                              ? `${API_URL}${user.avt}`
                              : user.avt
                            : "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp"
                        }
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{user.hoTen}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setViewModalOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setUpdateChiTietModalOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Sửa chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setConfirmationUser(user);
                            setConfirmationAction("hide");
                            setConfirmationOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Ẩn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1">
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="flex justify-between text-sm">
                    <span>{user.vaiTro === 1 ? "Admin" : user.vaiTro === 2 ? "Nhân viên" : "Người dùng"}</span>
                    <span>{new Date(user.ngayTao).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.trangThai === 1 ? "bg-crocus-100 text-crocus-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.trangThai === 1 ? "Hoạt động" : "Khóa"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                  className={currentPage === page ? "bg-purple-400 text-white hover:bg-purple-300" : ""}
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
        </TabsContent>

        <TabsContent value="khoiPhuc">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                className="pl-8 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchUsers();
                  }}
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border rounded-md p-2 pl-8"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="nhanvien">Nhân viên</option>
                <option value="nguoidung">Người dùng</option>
              </select>
            </div>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md p-2 pl-8"
              >
                <option value="all">Tất cả trạng thái</option>
              </select>
            </div>
          </div>

          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead className="w-[120px]">Hình Ảnh</TableHead>
                  <TableHead>Họ Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tài Khoản</TableHead>
                  <TableHead>Vai Trò</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="w-[120px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <TableRow key={user.maNguoiDung} className="hover:bg-muted/50">
                      <TableCell align="center">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                      <TableCell align="center">
                        <img
                          src={
                            user.avt
                              ? user.avt.startsWith("/Uploads")
                                ? `${API_URL}${user.avt}`
                                : user.avt
                              : "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp"
                          }
                          alt="Avatar"
                          className="w-16 h-16 rounded-full mx-auto mt-4 object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedUser(user);
                            setViewModalOpen(true);
                          }}
                        />
                      </TableCell>
                      <TableCell>{user.hoTen}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.taiKhoan || ""}</TableCell>
                      <TableCell>
                        {user.vaiTro === 1 ? "Admin" : user.vaiTro === 2 ? "Nhân viên" : "Người dùng"}
                      </TableCell>
                      <TableCell>
                        <label className="relative inline-block w-[60px] h-[34px]">
                          <input
                            type="checkbox"
                            className="opacity-0 w-0 h-0"
                            checked={user.trangThai === 1}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setConfirmationUser(user);
                                setConfirmationAction("restore");
                                setConfirmationOpen(true);
                              }
                            }}
                            disabled={confirmationOpen}
                          />
                          <span
                            className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                              before:absolute before:h-[30px] before:w-[30px] before:left-[2px] before:bottom-[2px]
                              before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                              ${
                                user.trangThai === 1
                                  ? "bg-crocus-500 before:translate-x-[26px]"
                                  : "bg-gray-400"
                              } hover:scale-110 shadow-sm hover:shadow-md`}
                          ></span>
                          <span className="sr-only">
                            {user.trangThai === 1 ? "Hoạt động" : "Ẩn"}
                          </span>
                        </label>
                      </TableCell>
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setViewModalOpen(true);
                              }}
                              className="text-green-700"
                            >
                              <Eye className="mr-2 h-4 w-4" /> Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setConfirmationUser(user);
                                setConfirmationAction("restore");
                                setConfirmationOpen(true);
                              }}
                              className="text-blue-700"
                            >
                              <RotateCcw className="mr-2 h-4 w-4" /> Khôi phục
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setConfirmationUser(user);
                                setConfirmationAction("delete");
                                setConfirmationOpen(true);
                              }}
                              className="text-red-700"
                            >
                              <Trash className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      Không có người dùng ẩn nào để hiển thị.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {currentUsers.map((user) => (
              <Card key={user.maNguoiDung}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          user.avt
                            ? user.avt.startsWith("/Uploads")
                              ? `${API_URL}${user.avt}`
                              : user.avt
                            : "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp"
                        }
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{user.hoTen}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setViewModalOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setConfirmationUser(user);
                            setConfirmationAction("restore");
                            setConfirmationOpen(true);
                          }}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" /> Khôi phục
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setConfirmationUser(user);
                            setConfirmationAction("delete");
                            setConfirmationOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1">
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="flex justify-between text-sm">
                    <span>{user.vaiTro === 1 ? "Admin" : user.vaiTro === 2 ? "Nhân viên" : "Người dùng"}</span>
                    <span>{new Date(user.ngayTao).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      Ẩn
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                  className={currentPage === page ? "bg-purple-400 text-white hover:bg-purple-300" : ""}
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
        </TabsContent>

        <TabsContent value="danhSachThongKe">
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Thống kê người dùng</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Người dùng mới hôm nay</h3>
                <p className="text-2xl font-bold">{stats.usersToday}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Tổng số người dùng</h3>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Người dùng hoạt động</h3>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Người dùng bị khóa</h3>
                <p className="text-2xl font-bold">{stats.lockedUsers}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Người dùng mới tháng này</h3>
                <p className="text-2xl font-bold">{stats.usersThisMonth}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Người dùng mới năm nay</h3>
                <p className="text-2xl font-bold">{stats.usersThisYear}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Biểu đồ thống kê</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Số lượng người dùng theo vai trò</h3>
                <Bar data={roleChartData} options={{ responsive: true }} />
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Tỷ lệ người dùng hoạt động và bị khóa</h3>
                <div style={{ height: "300px", width: "300px" }}>
                  <Pie data={statusChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Người dùng mới theo tháng trong năm {new Date().getFullYear()}
                </h3>
                <Line data={monthlyChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ChiTietNguoiDung
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        user={selectedUser}
      />
      <SuaNguoiDung
        open={updateChiTietModalOpen}
        onOpenChange={setUpdateChiTietModalOpen}
        user={selectedUser}
        fetchUsers={fetchUsers}
        users={users}
      />
    </div>
  );
};

export default AdminNguoiDung;