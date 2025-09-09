import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/pages/ui/dialog";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { User, Calendar, Phone, Mail, CreditCard, Home, Lock, X } from "lucide-react";
import { Button } from "@/pages/ui/button";

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

const API_URL = "http://localhost:5083";

interface ChiTietNguoiDungProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Account | null;
}

const ChiTietNguoiDung = ({ open, onOpenChange, user }: ChiTietNguoiDungProps) => {
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}, ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const getGioiTinhString = (gioiTinh: number) => {
    if (gioiTinh === 1) return "Nam";
    if (gioiTinh === 2) return "Nữ";
    return "Khác";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Chi Tiết Người Dùng</DialogTitle>
        </DialogHeader>
        {user && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <div>
                <Label>Hình Ảnh</Label>
                <img
                  src={
                    user.avt
                      ? user.avt.startsWith("/Uploads")
                        ? `${API_URL}${user.avt}`
                        : user.avt
                      : "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp"
                  }
                  alt="Avatar"
                  className="mt-2 w-64 h-64 object-cover rounded-full border-2 border-crocus-500"
                />
              </div>
              <div>
                <Label>Tiểu Sử</Label>
                <textarea
                  value={user.tieuSu || "Chưa cập nhật"}
                  readOnly
                  className="w-full p-2 border rounded cursor-not-allowed text-black border-2 border-crocus-300"
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
                    value={user.taiKhoan || "Chưa cập nhật"}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Họ Tên</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.hoTen || "Chưa cập nhật"}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Vai Trò</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={
                      user.vaiTro === 1
                        ? "Admin"
                        : user.vaiTro === 2
                        ? "Nhân viên"
                        : "Người dùng"
                    }
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Ngày Tạo</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.ngayTao ? formatDateTime(user.ngayTao) : "Chưa cập nhật"}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Giới Tính</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={getGioiTinhString(user.gioiTinh || 0)}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Trạng Thái</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.trangThai === 1 ? "Hoạt động" : user.trangThai === 0 ? "Khóa" : "Ẩn"}
                    disabled
                    className={`pl-8 font-semibold border-2 border-crocus-500 ${
                      user.trangThai === 1 ? "text-green-600" : user.trangThai === 0 ? "text-red-600" : "text-gray-600"
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-4">
              <div>
                <Label>Ngày Sinh</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={
                      user.ngaySinh
                        ? new Date(user.ngaySinh).toLocaleDateString("vi-VN")
                        : "Chưa cập nhật"
                    }
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Số Điện Thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.sdt || "Chưa cập nhật"}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.email || "Chưa cập nhật"}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>CCCD</Label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.cccd || "Chưa cập nhật"}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Địa Chỉ</Label>
                <div className="relative">
                  <Home className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.diaChi || "Chưa cập nhật"}
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
              <div>
                <Label>Thời Gian Khóa</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={
                      user.timeKhoa
                        ? formatDateTime(user.timeKhoa)
                        : "Không có"
                    }
                    disabled
                    className="pl-8 text-black border-2 border-crocus-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gray-500 hover:bg-gray-600"
          >
            <X className="h-4 w-4 mr-2" /> Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChiTietNguoiDung;