import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User, Lock, Send, Eye, EyeOff, Phone, UserPlus } from "lucide-react";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/pages/ui/card";

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    verificationCode: ["", "", "", "", "", ""],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...formData.verificationCode];
    newCode[index] = value;
    setFormData((prev) => ({ ...prev, verificationCode: newCode }));
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ");
      return;
    }
    setCodeSent(true);
    console.log("Gửi mã xác nhận đến:", formData.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu đăng ký:", formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
        <CardDescription className="text-center">Tạo tài khoản mới của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="pl-10 pr-24"
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

          {codeSent && (
            <div className="space-y-2">
              <Label>Mã xác nhận</Label>
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
          )}

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="pl-10"
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
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
            </div>
          </div>

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
