
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { Checkbox } from "@/pages/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/pages/ui/card";

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
    setError("");
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, rememberMe: checked });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Client-side validation
    if (!formData.username.trim()) {
      setError("Tài khoản là bắt buộc");
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Tài khoản là bắt buộc",
      });
      setIsLoading(false);
      return;
    }
    if (!formData.password) {
      setError("Mật khẩu là bắt buộc");
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Mật khẩu là bắt buộc",
      });
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/NguoiDung/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taiKhoan: formData.username,
          matKhau: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(
          errorData.Message || "Tài khoản hoặc mật khẩu không đúng"
        );
      }

      const userData = await response.json();
      console.log("Login successful:", userData);

      // Store maNguoiDung and taiKhoan in sessionStorage
      if (typeof Storage !== "undefined") {
        sessionStorage.setItem("userId", userData.maNguoiDung.toString());
        sessionStorage.setItem("taiKhoan", userData.taiKhoan || formData.username);
        if (formData.rememberMe) {
          localStorage.setItem("userId", userData.maNguoiDung.toString());
          localStorage.setItem("taiKhoan", userData.taiKhoan || formData.username);
        }
      }

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đăng nhập thành công!",
        timer: 1500,
        showConfirmButton: false,
        didClose: () => {
          window.location.reload();
        },
      });

      // Navigate based on vaiTro
      if (userData.vaiTro === 1) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi máy chủ nội bộ");
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Lỗi máy chủ nội bộ",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 via-purple-300 to-red-600 relative overflow-hidden rounded-[10px]"
>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md mx-auto relative z-10 backdrop-blur-lg bg-white/95 border-0 shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
            Đăng nhập - {import.meta.env.VITE_TITLE}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Nhập thông tin đăng nhập của bạn để truy cập tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm shadow-lg animate-pulse">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                {error}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-semibold">
                Tài khoản
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-purple-500 transition-colors" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Nhập tài khoản"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-12 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 shadow-sm hover:shadow-md transition-all duration-200"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 font-semibold">
                  Mật khẩu
                </Label>
                <Button
                  variant="link"
                  className="text-sm font-medium text-purple-600 hover:text-red-600 p-0 transition-colors"
                  onClick={() => navigate("/auth/forgot-password")}
                  disabled={isLoading}
                  type="button"
                >
                  Quên mật khẩu?
                </Button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-purple-500 transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 pr-12 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 shadow-sm hover:shadow-md transition-all duration-200"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors p-1 rounded-md hover:bg-purple-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none hover:text-purple-600 transition-colors"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              disabled={isLoading}
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <Button
                variant="outline"
                type="button"
                className="w-full h-12 hover:bg-gradient-to-r hover:from-purple-50 hover:to-red-50 hover:border-purple-300 group"
                disabled={isLoading}
                onClick={() => Swal.fire({
                  icon: "info",
                  title: "Chức năng đang phát triển",
                  text: "Đăng nhập với Google sẽ sớm được hỗ trợ!",
                })}
              >
                <svg className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-medium">Đăng nhập với Google</span>
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Button
              variant="link"
              className="font-semibold text-purple-600 hover:text-red-600 p-0 ml-1"
              onClick={() => navigate("/auth/register")}
              disabled={isLoading}
              type="button"
            >
              Đăng ký ngay
            </Button>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </CardFooter>
      </Card>
      <div className="absolute top-20 left-20 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-6 h-6 bg-red-400 rounded-full opacity-60 animate-bounce delay-300"></div>
      <div className="absolute top-1/2 left-10 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-bounce delay-700"></div>
    </div>
  );
};