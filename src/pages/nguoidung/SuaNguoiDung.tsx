import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/pages/ui/dialog";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { User, Calendar, Phone, Mail, CreditCard, Home, Lock, X, Save, Loader } from "lucide-react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:5083";

interface Account {
  maNguoiDung: number;
  hoTen: string;
  email: string;
  taiKhoan: string;
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

interface SuaNguoiDungProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Account | null;
  fetchUsers: () => Promise<void>;
  users: Account[];
}

const SuaNguoiDung = ({ open, onOpenChange, user, fetchUsers, users }: SuaNguoiDungProps) => {
  const [chiTietHoTen, setChiTietHoTen] = useState("");
  const [chiTietNgaySinh, setChiTietNgaySinh] = useState("");
  const [chiTietSdt, setChiTietSdt] = useState("");
  const [chiTietCccd, setChiTietCccd] = useState("");
  const [chiTietEmail, setChiTietEmail] = useState("");
  const [chiTietTaiKhoan, setChiTietTaiKhoan] = useState("");
  const [chiTietDiaChi, setChiTietDiaChi] = useState("");
  const [chiTietVaiTro, setChiTietVaiTro] = useState(0);
  const [chiTietTrangThai, setChiTietTrangThai] = useState(0);
  const [chiTietAvt, setChiTietAvt] = useState<string | null>(null);
  const [chiTietTieuSu, setChiTietTieuSu] = useState("");
  const [chiTietGioiTinh, setChiTietGioiTinh] = useState(0);
  const [chiTietTimeKhoa, setChiTietTimeKhoa] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setChiTietHoTen(user.hoTen || "");
      setChiTietNgaySinh(user.ngaySinh ? new Date(user.ngaySinh).toISOString().split("T")[0] : "");
      setChiTietSdt(user.sdt || "");
      setChiTietCccd(user.cccd || "");
      setChiTietEmail(user.email || "");
      setChiTietTaiKhoan(user.taiKhoan || "");
      setChiTietDiaChi(user.diaChi || "");
      setChiTietVaiTro(user.vaiTro || 0);
      setChiTietTrangThai(user.trangThai || 0);
      setChiTietAvt(
        user.avt
          ? user.avt.startsWith("/Uploads")
            ? `${API_URL}${user.avt}`
            : user.avt
          : null
      );
      setChiTietTieuSu(user.tieuSu || "");
      setChiTietGioiTinh(user.gioiTinh || 0);
      setChiTietTimeKhoa(
        user.trangThai === 1 ? null : user.timeKhoa ? new Date(user.timeKhoa).toISOString().split("T")[0] : null
      );
      setErrors({});
    }
  }, [user]);

  const validateHoTen = (hoTen: string) => {
    if (!hoTen) return "Họ tên không được để trống";
    if (hoTen.length <= 5) return "Họ tên phải dài hơn 5 ký tự";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email không được để trống";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    return "";
  };

  const validateSdt = (sdt: string) => {
    if (sdt && !/^\d{10}$/.test(sdt)) return "Số điện thoại phải có đúng 10 chữ số";
    return "";
  };

  const validateCccd = (cccd: string) => {
    if (cccd && !/^\d{12}$/.test(cccd)) return "CCCD phải có đúng 12 chữ số";
    return "";
  };

  const validateNgaySinh = (ngaySinh: string) => {
    if (ngaySinh) {
      const birthDate = new Date(ngaySinh);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 15) return "Người dùng phải ít nhất 15 tuổi";
    }
    return "";
  };

  const validateTimeKhoa = (timeKhoa: string | null, trangThai: number) => {
    if (trangThai === 0 && !timeKhoa) {
      return "Ngày kết thúc khóa là bắt buộc khi trạng thái là Khóa";
    }
    if (trangThai === 0 && timeKhoa) {
      const selectedDate = new Date(timeKhoa);
      const today = new Date();
      if (selectedDate <= today) return "Ngày kết thúc khóa phải là ngày trong tương lai";
    }
    return "";
  };

  const validateTaiKhoanUnique = (taiKhoan: string, currentMaNguoiDung?: number) => {
    if (!taiKhoan) return "Tài khoản không được để trống";
    const existingUser = users.find(
      (u) => u.taiKhoan === taiKhoan && u.maNguoiDung !== currentMaNguoiDung
    );
    if (existingUser) return "Tài khoản đã tồn tại";
    return "";
  };

  const validateEmailUnique = (email: string, currentMaNguoiDung?: number) => {
    if (!email) return "Email không được để trống";
    const existingUser = users.find(
      (u) => u.email === email && u.maNguoiDung !== currentMaNguoiDung
    );
    if (existingUser) return "Email đã tồn tại";
    return "";
  };

  const validateSdtUnique = (sdt: string, currentMaNguoiDung?: number) => {
    if (!sdt) return "";
    const existingUser = users.find(
      (u) => u.sdt === sdt && u.maNguoiDung !== currentMaNguoiDung
    );
    if (existingUser) return "Số điện thoại đã tồn tại";
    return "";
  };

  const validateCccdUnique = (cccd: string, currentMaNguoiDung?: number) => {
    if (!cccd) return "";
    const existingUser = users.find(
      (u) => u.cccd === cccd && u.maNguoiDung !== currentMaNguoiDung
    );
    if (existingUser) return "CCCD đã tồn tại";
    return "";
  };

  const handleSdtInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) setChiTietSdt(value);
  };

  const handleCccdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) setChiTietCccd(value);
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
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setChiTietAvt(imageUrl);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn file hình ảnh",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleImageClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setChiTietAvt(imageUrl);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn file hình ảnh",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleUpdateChiTietSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    newErrors.chiTietHoTen = validateHoTen(chiTietHoTen);
    newErrors.chiTietEmail = validateEmail(chiTietEmail);
    newErrors.chiTietSdt = validateSdt(chiTietSdt);
    newErrors.chiTietCccd = validateCccd(chiTietCccd);
    newErrors.chiTietNgaySinh = validateNgaySinh(chiTietNgaySinh);
    newErrors.chiTietTimeKhoa = validateTimeKhoa(chiTietTimeKhoa, chiTietTrangThai);
    newErrors.chiTietTaiKhoanUnique = validateTaiKhoanUnique(chiTietTaiKhoan, user?.maNguoiDung);
    newErrors.chiTietEmailUnique = validateEmailUnique(chiTietEmail, user?.maNguoiDung);
    newErrors.chiTietSdtUnique = validateSdtUnique(chiTietSdt, user?.maNguoiDung);
    newErrors.chiTietCccdUnique = validateCccdUnique(chiTietCccd, user?.maNguoiDung);

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("MaNguoiDung", user?.maNguoiDung.toString() || "");
      formData.append("HoTen", chiTietHoTen);
      formData.append("Email", chiTietEmail);
      formData.append("TaiKhoan", chiTietTaiKhoan);
      formData.append("VaiTro", chiTietVaiTro.toString());
      formData.append("TrangThai", chiTietTrangThai.toString());
      if (chiTietSdt) formData.append("Sdt", chiTietSdt);
      if (chiTietCccd) formData.append("Cccd", chiTietCccd);
      if (chiTietDiaChi) formData.append("DiaChi", chiTietDiaChi);
      if (chiTietTieuSu) formData.append("TieuSu", chiTietTieuSu);
      if (chiTietGioiTinh !== undefined) formData.append("GioiTinh", chiTietGioiTinh.toString());
      if (chiTietNgaySinh) formData.append("NgaySinh", chiTietNgaySinh);
      if (chiTietTimeKhoa && chiTietTrangThai === 0) formData.append("TimeKhoa", chiTietTimeKhoa);

      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("Avt", fileInput.files[0]);
      }

      const response = await fetch(`${API_URL}/api/NguoiDung/${user?.maNguoiDung}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Lỗi khi cập nhật thông tin người dùng");

      await fetchUsers();
      onOpenChange(false);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật thông tin người dùng thành công",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: (err as Error).message || "Lỗi khi cập nhật thông tin người dùng",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Sửa Thông Tin Người Dùng</DialogTitle>
        </DialogHeader>
        {user && (
          <form onSubmit={handleUpdateChiTietSubmit} className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <div>
                <Label>Hình Ảnh</Label>
                <div
                  className={`mt-2 w-64 h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${
                    isDragging ? "border-crocus-500 bg-crocus-100" : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleImageClick}
                >
                  {chiTietAvt ? (
                    <img
                      src={chiTietAvt}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-500">Kéo và thả hình ảnh hoặc nhấn để chọn</span>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <Label>Tiểu Sử</Label>
                <textarea
                  value={chiTietTieuSu}
                  onChange={(e) => setChiTietTieuSu(e.target.value)}
                  className="w-full p-2 border rounded text-black border-2 border-crocus-300"
                  rows={4}
                />
              </div>
            </div>
            <div className="col-span-1 space-y-4">
              <div>
                <Label>Tài Khoản</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={chiTietTaiKhoan}
                    onChange={(e) => setChiTietTaiKhoan(e.target.value)}
                    className="pl-8 text-black border-2 border-crocus-500"
                    required
                  />
                </div>
                {errors.chiTietTaiKhoanUnique && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietTaiKhoanUnique}</p>
                )}
              </div>
              <div>
                <Label>Họ Tên</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={chiTietHoTen}
                    onChange={(e) => setChiTietHoTen(e.target.value)}
                    className="pl-8 text-black border-2 border-crocus-500"
                    required
                  />
                </div>
                {errors.chiTietHoTen && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietHoTen}</p>
                )}
              </div>
              <div>
                <Label>Vai Trò</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select
                    value={chiTietVaiTro}
                    onChange={(e) => setChiTietVaiTro(Number(e.target.value))}
                    className="w-full border rounded-md p-2 pl-8 text-black border-2 border-crocus-500"
                  >
                    <option value={0}>Người dùng</option>
                    <option value={1}>Admin</option>
                    <option value={2}>Nhân viên</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Ngày Tạo</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.ngayTao ? new Date(user.ngayTao).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Giới Tính</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select
                    value={chiTietGioiTinh}
                    onChange={(e) => setChiTietGioiTinh(Number(e.target.value))}
                    className="w-full border rounded-md p-2 pl-8 text-black border-2 border-crocus-500"
                  >
                    <option value={0}>Khác</option>
                    <option value={1}>Nam</option>
                    <option value={2}>Nữ</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Trạng Thái</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select
                    value={chiTietTrangThai}
                    onChange={(e) => {
                      const newStatus = Number(e.target.value);
                      setChiTietTrangThai(newStatus);
                      if (newStatus === 1) setChiTietTimeKhoa(null);
                    }}
                    className="w-full border rounded-md p-2 pl-8 text-black border-2 border-crocus-500"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Khóa</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-4">
              <div>
                <Label>Ngày Sinh</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={chiTietNgaySinh}
                    onChange={(e) => setChiTietNgaySinh(e.target.value)}
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
                {errors.chiTietNgaySinh && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietNgaySinh}</p>
                )}
              </div>
              <div>
                <Label>Số Điện Thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={chiTietSdt}
                    onChange={handleSdtInput}
                    className="pl-8 text-black border-2 border-crocus-500"
                    placeholder="Nhập số điện thoại (10 chữ số)"
                  />
                </div>
                {errors.chiTietSdt && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietSdt}</p>
                )}
                {errors.chiTietSdtUnique && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietSdtUnique}</p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={chiTietEmail}
                    onChange={(e) => setChiTietEmail(e.target.value)}
                    className="pl-8 text-black border-2 border-crocus-500"
                    required
                  />
                </div>
                {errors.chiTietEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietEmail}</p>
                )}
                {errors.chiTietEmailUnique && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietEmailUnique}</p>
                )}
              </div>
              <div>
                <Label>CCCD</Label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={chiTietCccd}
                    onChange={handleCccdInput}
                    className="pl-8 text-black border-2 border-crocus-500"
                    placeholder="Nhập CCCD (12 chữ số)"
                  />
                </div>
                {errors.chiTietCccd && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietCccd}</p>
                )}
                {errors.chiTietCccdUnique && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietCccdUnique}</p>
                )}
              </div>
              <div>
                <Label>Địa Chỉ</Label>
                <div className="relative">
                  <Home className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={chiTietDiaChi}
                    onChange={(e) => setChiTietDiaChi(e.target.value)}
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Thời Gian Khóa</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={chiTietTimeKhoa || ""}
                    onChange={(e) => setChiTietTimeKhoa(e.target.value)}
                    className="pl-8 text-black border-2 border-crocus-500"
                    disabled={chiTietTrangThai === 1}
                  />
                </div>
                {errors.chiTietTimeKhoa && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiTietTimeKhoa}</p>
                )}
              </div>
            </div>
            <div className="col-span-3 flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="bg-gray-500 hover:bg-gray-600"
              >
                <X className="h-4 w-4 mr-2" /> Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Lưu
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuaNguoiDung;