import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User, Lock, Send } from "lucide-react";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/pages/ui/card";

export const Register = () => {
  // Quản lý trạng thái của form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    verificationCode: ["", "", "", "", "", ""], // Mã xác nhận 6 ký tự
  });

  // Xử lý thay đổi giá trị của các trường nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý thay đổi cho các ô mã xác nhận
  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Chỉ cho phép 1 ký tự
    const newCode = [...formData.verificationCode];
    newCode[index] = value;
    setFormData({ ...formData, verificationCode: newCode });

    // Tự động chuyển sang ô tiếp theo nếu nhập xong
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đăng ký:", formData);
    // Thêm logic gửi dữ liệu đến server tại đây nếu cần
  };

  // Xử lý khi nhấn nút "Gửi mã"
  const handleSendCode = () => {
    console.log("Gửi mã xác nhận đến email:", formData.email);
    // Thêm logic gửi mã xác nhận tại đây
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
        <CardDescription className="text-center">
          Tạo tài khoản mới của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trường Họ tên */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ tên</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="fullName"
                name="fullName"
                placeholder="Nhập họ và tên"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Trường Email với nút "Gửi mã" */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="email"
                name="email"
                placeholder="Nhập email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 pr-24" // Thêm padding phải để chừa chỗ cho nút
              />
              <Button
                type="button"
                onClick={handleSendCode}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-crocus-500 hover:bg-crocus-600 text-white text-sm px-3 py-1 flex items-center"
              >
                <Send className="mr-1 h-4 w-4" />
                Gửi
              </Button>
            </div>
          </div>

          {/* Nhóm 6 ô nhập mã xác nhận */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              {formData.verificationCode.map((code, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={code}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-10 h-10 text-center"
                />
              ))}
            </div>
          </div>

          {/* Trường Tài khoản */}
          <div className="space-y-2">
            <Label htmlFor="username">Tài khoản</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="username"
                name="username"
                placeholder="Nhập tài khoản"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Trường Mật khẩu */}
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Nút Đăng ký với icon */}
          <Button type="submit" className="w-full bg-crocus-500 hover:bg-crocus-600">
            <UserPlus className="mr-2 h-4 w-4" /> Đăng ký
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm">
          Đã có tài khoản?{" "}
          <Link to="/auth/login" className="font-medium text-crocus-600 hover:text-crocus-700">
            Đăng nhập
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};