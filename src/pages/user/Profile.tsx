import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/pages/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/pages/ui/select";
import { Textarea } from "@/pages/ui/textarea";
import { Camera, User, Mail as MailIcon, Phone as PhoneIcon, Lock, Save, Key } from "lucide-react";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/pages/ui/card";

export const Profile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem("userId"));
  const [date, setDate] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [personalFormData, setPersonalFormData] = useState({
    avt: "",
    hoTen: "",
    email: "",
    sdt: "",
    taiKhoan: "",
    tieuSu: "",
    gioiTinh: "0",
    vaiTro: "0",
    trangThai: "1",
    timeKhoa: "",
  });
  const [securityFormData, setSecurityFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Base API URL for images
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Redirect to login if userId is missing
  useEffect(() => {
    if (!userId) {
      navigate("/auth/login");
    }
  }, [userId, navigate]);

  // Fetch user data on component mount
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/NguoiDung/${userId}`);
          if (!response.ok) {
            throw new Error("Không thể tải dữ liệu người dùng");
          }
          const data = await response.json();
          setPersonalFormData({
            avt: data.avt || "",
            hoTen: data.hoTen || "",
            email: data.email || "",
            sdt: data.sdt || "",
            taiKhoan: data.taiKhoan || "",
            tieuSu: data.tieuSu || "",
            gioiTinh: (data.gioiTinh ?? 0).toString(),
            vaiTro: (data.vaiTro ?? 0).toString(),
            trangThai: (data.trangThai ?? 1).toString(),
            timeKhoa: data.timeKhoa || "",
          });
          if (data.ngaySinh) {
            setDate(data.ngaySinh.split("T")[0]);
          }
          setAvatar(data.avt ? `${API_BASE_URL}${data.avt}` : null);
        } catch (err: any) {
          console.error("Lỗi khi tải dữ liệu người dùng:", err);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: err.message || "Không thể tải dữ liệu người dùng",
          });
        }
      };
      fetchUserData();
    }
  }, [userId, API_BASE_URL]);

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalFormData({ ...personalFormData, [name]: value.trim() });
  };

  const handleGenderChange = (value: string) => {
    setPersonalFormData({ ...personalFormData, gioiTinh: value });
  };

  const handleSecurityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityFormData({ ...securityFormData, [name]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarError = () => {
    setAvatar(null);
  };

  const handlePersonalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (!personalFormData.hoTen.trim()) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Họ và tên là bắt buộc" });
      setIsLoading(false);
      return;
    }
    if (!personalFormData.email.trim()) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Email là bắt buộc" });
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalFormData.email.trim())) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Email không hợp lệ" });
      setIsLoading(false);
      return;
    }
    if (!personalFormData.taiKhoan.trim()) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Tài khoản là bắt buộc" });
      setIsLoading(false);
      return;
    }
    if (personalFormData.sdt && !/^\+?\d{10,15}$/.test(personalFormData.sdt)) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Số điện thoại không hợp lệ" });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("MaNguoiDung", userId || "");
      formData.append("HoTen", personalFormData.hoTen);
      formData.append("Email", personalFormData.email);
      formData.append("TaiKhoan", personalFormData.taiKhoan);
      formData.append("Sdt", personalFormData.sdt || "");
      formData.append("TieuSu", personalFormData.tieuSu || "");
      formData.append("GioiTinh", personalFormData.gioiTinh);
      formData.append("VaiTro", personalFormData.vaiTro);
      formData.append("TrangThai", personalFormData.trangThai);
      if (date) {
        formData.append("NgaySinh", new Date(date).toISOString());
      }
      if (personalFormData.timeKhoa) {
        formData.append("TimeKhoa", personalFormData.timeKhoa);
      }
      if (avatarFile) {
        formData.append("imageFile", avatarFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/NguoiDung/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || Object.values(errorData.errors || {}).flat().join("; ") || "Không thể cập nhật thông tin");
      }

      const updatedData = await response.json();
      setAvatar(updatedData.avt ? `${API_BASE_URL}${updatedData.avt}` : null);
      Swal.fire({ icon: "success", title: "Thành công", text: "Cập nhật thông tin cá nhân thành công!" });
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message || "Lỗi máy chủ nội bộ" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (!securityFormData.currentPassword) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Mật khẩu hiện tại là bắt buộc" });
      setIsLoading(false);
      return;
    }
    if (!securityFormData.newPassword) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Mật khẩu mới là bắt buộc" });
      setIsLoading(false);
      return;
    }
    if (securityFormData.newPassword.length < 6) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      setIsLoading(false);
      return;
    }
    if (securityFormData.newPassword !== securityFormData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Mật khẩu mới và xác nhận mật khẩu không khớp" });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("MaNguoiDung", userId || "");
      formData.append("MatKhauCu", securityFormData.currentPassword);
      formData.append("MatKhauMoi", securityFormData.newPassword);
      formData.append("XacNhanMatKhau", securityFormData.confirmPassword);
      formData.append("VaiTro", personalFormData.vaiTro);
      formData.append("TrangThai", personalFormData.trangThai);

      const response = await fetch(`${API_BASE_URL}/api/NguoiDung/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || Object.values(errorData.errors || {}).flat().join("; ") || "Không thể thay đổi mật khẩu");
      }

      Swal.fire({ icon: "success", title: "Thành công", text: "Thay đổi mật khẩu thành công!" });
      setSecurityFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message || "Lỗi máy chủ nội bộ" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-red-50 p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header with gradient */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
            Hồ Sơ Cá Nhân
          </h1>
          <p className="text-gray-600">Quản lý thông tin và bảo mật tài khoản của bạn</p>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 bg-white/70 backdrop-blur-sm shadow-lg rounded-xl p-1 border border-purple-100">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
            >
              <User className="mr-2 h-4 w-4" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
            >
              <Lock className="mr-2 h-4 w-4" />
              Bảo mật
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-purple-100 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Thông tin cá nhân - {import.meta.env.VITE_TITLE}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Cập nhật thông tin chi tiết của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePersonalSubmit} className="space-y-8">
                  {/* Avatar Section with enhanced styling */}
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative mb-6 group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 p-1 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt="Ảnh đại diện"
                              className="w-full h-full object-cover"
                              onError={handleAvatarError}
                            />
                          ) : (
                            <User size={64} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      <label
                        htmlFor="avatarUpload"
                        className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                      >
                        <Camera size={18} />
                        <span className="sr-only">Tải ảnh đại diện</span>
                      </label>
                      <input
                        id="avatarUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="hoTen" className="text-gray-700 font-medium">
                        Họ và tên
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors" size={18} />
                        <Input
                          id="hoTen"
                          name="hoTen"
                          placeholder="Nhập họ và tên"
                          value={personalFormData.hoTen}
                          onChange={handlePersonalInputChange}
                          className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          disabled={isLoading}
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="taiKhoan" className="text-gray-700 font-medium">
                        Tài khoản
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors" size={18} />
                        <Input
                          id="taiKhoan"
                          name="taiKhoan"
                          placeholder="Nhập tài khoản"
                          value={personalFormData.taiKhoan}
                          onChange={handlePersonalInputChange}
                          className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          disabled={isLoading}
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email
                      </Label>
                      <div className="relative group">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 group-focus-within:text-pink-600 transition-colors" size={18} />
                        <Input
                          id="email"
                          name="email"
                          placeholder="Nhập email"
                          type="email"
                          value={personalFormData.email}
                          onChange={handlePersonalInputChange}
                          className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="sdt" className="text-gray-700 font-medium">
                        Số điện thoại
                      </Label>
                      <div className="relative group">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 group-focus-within:text-red-600 transition-colors" size={18} />
                        <Input
                          id="sdt"
                          name="sdt"
                          placeholder="Nhập số điện thoại"
                          type="tel"
                          value={personalFormData.sdt}
                          onChange={handlePersonalInputChange}
                          className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          disabled={isLoading}
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="tieuSu" className="text-gray-700 font-medium">
                        Tiểu sử
                      </Label>
                      <Textarea
                        id="tieuSu"
                        name="tieuSu"
                        placeholder="Nhập tiểu sử ngắn gọn về bạn"
                        value={personalFormData.tieuSu}
                        onChange={handlePersonalInputChange}
                        className="min-h-[120px] border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 resize-none"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="gioiTinh" className="text-gray-700 font-medium">
                        Giới tính
                      </Label>
                      <Select value={personalFormData.gioiTinh} onValueChange={handleGenderChange} disabled={isLoading}>
                        <SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-purple-200">
                          <SelectItem value="0">Không xác định</SelectItem>
                          <SelectItem value="1">Nam</SelectItem>
                          <SelectItem value="2">Nữ</SelectItem>
                          <SelectItem value="3">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="ngaySinh" className="text-gray-700 font-medium">
                        Ngày sinh
                      </Label>
                      <Input
                        id="ngaySinh"
                        name="ngaySinh"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        disabled={isLoading}
                        max={`${new Date().getFullYear() - 13}-12-31`}
                        className="border-red-200 focus:border-red-500 focus:ring-red-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="timeKhoa" className="text-gray-700 font-medium">
                        Thời gian khóa tài khoản
                      </Label>
                      <Input
                        id="timeKhoa"
                        name="timeKhoa"
                        value={personalFormData.timeKhoa || "Chưa bị khóa"}
                        disabled
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 rounded-xl shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-purple-100">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
                      disabled={isLoading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-red-100 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Thay đổi mật khẩu - {import.meta.env.VITE_TITLE}
                </CardTitle>
                <CardDescription className="text-red-100">
                  Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                      Mật khẩu hiện tại
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 group-focus-within:text-red-600 transition-colors" size={18} />
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Nhập mật khẩu hiện tại"
                        type="password"
                        value={securityFormData.currentPassword}
                        onChange={handleSecurityInputChange}
                        className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                      Mật khẩu mới
                    </Label>
                    <div className="relative group">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors" size={18} />
                      <Input
                        id="newPassword"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        type="password"
                        value={securityFormData.newPassword}
                        onChange={handleSecurityInputChange}
                        className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Xác nhận mật khẩu mới
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 group-focus-within:text-pink-600 transition-colors" size={18} />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu mới"
                        type="password"
                        value={securityFormData.confirmPassword}
                        onChange={handleSecurityInputChange}
                        className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Security Tips */}
                  <div className="bg-gradient-to-r from-purple-50 to-red-50 border border-purple-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-purple-500" />
                      Mẹo bảo mật
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Sử dụng ít nhất 6 ký tự</li>
                      <li>• Kết hợp chữ hoa, chữ thường và số</li>
                      <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                    </ul>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-red-100">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
                      disabled={isLoading}
                    >
                      <Key className="mr-2 h-4 w-4" />
                      {isLoading ? "Đang xử lý..." : "Thay đổi mật khẩu"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};