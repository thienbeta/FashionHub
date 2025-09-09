import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/pages/ui/card";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    vaiTro: 0, // Default to Customer
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.fullName.trim()) {
      setError("Họ tên không được để trống");
      setIsLoading(false);
      return;
    }
    if (!emailRegex.test(formData.email.trim())) {
      setError("Email không hợp lệ");
      setIsLoading(false);
      return;
    }
    if (!formData.username.trim()) {
      setError("Tài khoản không được để trống");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("HoTen", formData.fullName.trim());
    formDataPayload.append("Email", formData.email.trim());
    formDataPayload.append("TaiKhoan", formData.username.trim());
    formDataPayload.append("MatKhau", formData.password);
    formDataPayload.append("VaiTro", formData.vaiTro.toString());

    console.log("Request Payload:", Object.fromEntries(formDataPayload)); // Debug: Log payload

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/NguoiDung`, {
        method: "POST",
        body: formDataPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData); // Debug: Log error response
        const errorMessage = errorData.Message || Object.values(errorData.errors || {}).flat().join("; ") || "Đã xảy ra lỗi khi đăng ký";
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("API Success Response:", result); // Debug: Log success response
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/auth/login");
    } catch (err: any) {
      setError(err.message || "Lỗi máy chủ nội bộ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Đăng ký - {import.meta.env.VITE_TITLE}
        </CardTitle>
        <CardDescription className="text-center">Tạo tài khoản mới của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
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
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="email"
                name="email"
                placeholder="Nhập email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

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
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-crocus-500 hover:bg-crocus-600"
            disabled={isLoading}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm">
          Đã có tài khoản?{" "}
          <Button
            variant="link"
            className="font-medium text-crocus-600 hover:text-crocus-700 p-0"
            onClick={() => navigate("/auth/login")}
          >
            Đăng nhập
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};