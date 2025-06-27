import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle, Lock, Mail, Key, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ForgotPasswordStep = "email" | "otp" | "newPassword";

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Email là bắt buộc");
      return;
    }
    
    // Simulate API call to send OTP
    console.log("Đang gửi mã OTP đến:", email);
    setError("");
    setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp) {
      setError("Mã OTP là bắt buộc");
      return;
    }
    
    // Simulate OTP verification
    console.log("Đang xác nhận mã OTP:", otp);
    setError("");
    setStep("newPassword");
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError("Mật khẩu mới là bắt buộc");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }
    
    // Simulate password reset
    console.log("Đang đặt lại mật khẩu");
    setError("");
    // Redirect to login page or show success message
  };

  const handleResendOtp = () => {
    // Simulate resending OTP
    console.log("Đang gửi lại mã OTP đến:", email);
    // Thêm logic thực tế nếu cần
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {step === "email" && "Quên mật khẩu"}
          {step === "otp" && "Nhập mã xác nhận"}
          {step === "newPassword" && "Đặt mật khẩu mới"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === "email" && "Nhập email của bạn để nhận mã OTP"}
          {step === "otp" && "Nhập mã xác nhận đã gửi đến email của bạn"}
          {step === "newPassword" && "Tạo mật khẩu mới an toàn"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-crocus-500 hover:bg-crocus-600">
              <KeyRound className="mr-2 h-4 w-4" /> Gửi OTP
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Mã xác nhận</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="otp"
                  placeholder="Nhập mã"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="pl-10 text-center text-lg tracking-widest"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-crocus-500 hover:bg-crocus-600">
              <CheckCircle className="mr-2 h-4 w-4" /> Xác nhận mã
            </Button>
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-crocus-600 hover:text-crocus-700 flex items-center justify-center mx-auto"
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Gửi lại OTP
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-crocus-600 hover:text-crocus-700 flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="mr-1 h-3 w-3" /> Quay lại email
              </button>
            </div>
          </form>
        )}

        {step === "newPassword" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-crocus-500 hover:bg-crocus-600">
              <Lock className="mr-2 h-4 w-4" /> Đặt lại mật khẩu
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm">
          Nhớ mật khẩu của bạn?{" "}
          <Link to="/auth/login" className="font-medium text-crocus-600 hover:text-crocus-700">
            Đăng nhập
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};