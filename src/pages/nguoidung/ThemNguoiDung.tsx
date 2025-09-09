import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/pages/ui/dialog";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { User, Mail, Lock, Eye, EyeOff, Plus, Loader, X, UserPlus } from "lucide-react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:5083";

interface ThemNguoiDungProps {
  fetchUsers: () => Promise<void>;
}

const ThemNguoiDung = ({ fetchUsers }: ThemNguoiDungProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    hoTen: "",
    email: "",
    taiKhoan: "",
    matKhau: "",
    vaiTro: "0",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateHoTen = (hoTen: string) => {
    if (hoTen.length <= 5) return "Họ tên phải dài hơn 5 ký tự";
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    return "";
  };

  const validateMatKhau = (matKhau: string) => {
    if (matKhau.length <= 5) return "Mật khẩu phải dài hơn 5 ký tự";
    return "";
  };

  const validateTaiKhoan = (taiKhoan: string) => {
    if (!taiKhoan) return "Tài khoản không được để trống";
    if (taiKhoan.length <= 5) return "Tài khoản phải dài hơn 5 ký tự";
    return "";
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    newErrors.hoTen = validateHoTen(newUser.hoTen);
    newErrors.email = validateEmail(newUser.email);
    newErrors.taiKhoan = validateTaiKhoan(newUser.taiKhoan);
    newErrors.matKhau = validateMatKhau(newUser.matKhau);

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("HoTen", newUser.hoTen);
      formData.append("Email", newUser.email);
      formData.append("TaiKhoan", newUser.taiKhoan);
      formData.append("MatKhau", newUser.matKhau);
      formData.append("VaiTro", newUser.vaiTro);

      const response = await fetch(`${API_URL}/api/NguoiDung`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Lỗi khi thêm người dùng");
      await fetchUsers();
      setOpenModal(false);
      setNewUser({
        hoTen: "",
        email: "",
        taiKhoan: "",
        matKhau: "",
        vaiTro: "0",
      });
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm người dùng thành công",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: (err as Error).message || "Lỗi khi thêm người dùng",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button className="bg-crocus-500 hover:bg-crocus-600">
          <UserPlus className="h-4 w-4 mr-2" /> Thêm Người Dùng
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <Label htmlFor="hoTen">Họ Tên</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="hoTen"
                placeholder="Nhập họ tên"
                value={newUser.hoTen}
                onChange={(e) => setNewUser({ ...newUser, hoTen: e.target.value })}
                className="pl-8"
                required
              />
            </div>
            {errors.hoTen && <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="pl-8"
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="taiKhoan">Tài Khoản</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="taiKhoan"
                placeholder="Nhập tài khoản"
                value={newUser.taiKhoan}
                onChange={(e) => setNewUser({ ...newUser, taiKhoan: e.target.value })}
                className="pl-8"
                required
              />
            </div>
            {errors.taiKhoan && <p className="text-red-500 text-sm mt-1">{errors.taiKhoan}</p>}
          </div>
          <div>
            <Label htmlFor="matKhau">Mật Khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="matKhau"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={newUser.matKhau}
                onChange={(e) => setNewUser({ ...newUser, matKhau: e.target.value })}
                className="pl-8 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-2 h-4 w-4 text-muted-foreground"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.matKhau && <p className="text-red-500 text-sm mt-1">{errors.matKhau}</p>}
          </div>
          <div>
            <Label htmlFor="vaiTro">Vai Trò</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                id="vaiTro"
                value={newUser.vaiTro}
                onChange={(e) => setNewUser({ ...newUser, vaiTro: e.target.value })}
                className="w-full border rounded-md p-2 pl-8"
              >
                <option value="0">Người dùng</option>
                <option value="1">Admin</option>
                <option value="2">Nhân viên</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={() => setOpenModal(false)} disabled={loading}>
              <X className="h-4 w-4 mr-2" /> Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Thêm
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ThemNguoiDung;