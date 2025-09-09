import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle, Lock, Mail, Key, RefreshCw } from "lucide-react";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/pages/ui/card";

type ForgotPasswordStep = "email" | "otp" | "newPassword";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState(sessionStorage.getItem("forgotPasswordEmail") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear sessionStorage after 10 minutes
  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.removeItem("forgotPasswordEmail");
      sessionStorage.removeItem("forgotPasswordOtp");
      if (step !== "newPassword") {
        setStep("email");
        setEmail("");
        setOtp("");
        setError("Phiên OTP đã hết hạn. Vui lòng bắt đầu lại.");
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearTimeout(timeout);
  }, [step]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Email là bắt buộc");
      setIsLoading(false);
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError("Email không hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/NguoiDung/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email.trim()),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response (forgot-password):", errorData);
        throw new Error(errorData.Message || "Không thể gửi OTP. Vui lòng thử lại.");
      }

      sessionStorage.setItem("forgotPasswordEmail", email.trim());
      console.log("OTP sent to:", email);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Lỗi máy chủ nội bộ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!otp.trim()) {
      setError("Mã OTP là bắt buộc");
      setIsLoading(false);
      return;
    }
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Mã OTP phải là 6 chữ số");
      setIsLoading(false);
      return;
    }

    sessionStorage.setItem("forgotPasswordOtp", otp.trim());
    setStep("newPassword");
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!newPassword) {
      setError("Mật khẩu mới là bắt buộc");
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      setIsLoading(false);
      return;
    }

    const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
    const storedOtp = sessionStorage.getItem("forgotPasswordOtp");

    if (!storedEmail || !storedOtp) {
      setError("Dữ liệu phiên không hợp lệ. Vui lòng bắt đầu lại.");
      setStep("email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/NguoiDung/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: storedEmail,
          otp: storedOtp,
          matKhauMoi: newPassword,
          xacNhanMatKhau: confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response (reset-password):", errorData);
        const errorMessage = errorData.Message || Object.values(errorData.errors || {}).flat().join("; ") || "Không thể đặt lại mật khẩu.";
        throw new Error(errorMessage);
      }

      console.log("Password reset successful");
      sessionStorage.removeItem("forgotPasswordEmail");
      sessionStorage.removeItem("forgotPasswordOtp");
      alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/auth/login");
    } catch (err: any) {
      setError(err.message || "Lỗi máy chủ nội bộ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);

    const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
    if (!storedEmail) {
      setError("Không tìm thấy email. Vui lòng bắt đầu lại.");
      setStep("email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/NguoiDung/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storedEmail),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response (resend OTP):", errorData);
        throw new Error(errorData.Message || "Không thể gửi lại OTP. Vui lòng thử lại.");
      }

      console.log("OTP resent to:", storedEmail);
      setError("Đã gửi lại OTP. Vui lòng kiểm tra email.");
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
          {step === "email" && `Quên mật khẩu - ${import.meta.env.VITE_TITLE}`}
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
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-crocus-500 hover:bg-crocus-600"
              disabled={isLoading}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              {isLoading ? "Đang xử lý..." : "Gửi OTP"}
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
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-crocus-500 hover:bg-crocus-600"
              disabled={isLoading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isLoading ? "Đang xử lý..." : "Xác nhận mã"}
            </Button>
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-crocus-600 hover:text-crocus-700 flex items-center justify-center mx-auto"
                disabled={isLoading}
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Gửi lại OTP
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-crocus-600 hover:text-crocus-700 flex items-center justify-center mx-auto"
                disabled={isLoading}
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
                  minLength={6}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  autoComplete="new-password"
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
                  minLength={6}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  autoComplete="new-password"
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

            <Button
              type="submit"
              className="w-full bg-crocus-500 hover:bg-crocus-600"
              disabled={isLoading}
            >
              <Lock className="mr-2 h-4 w-4" />
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm">
          Nhớ mật khẩu của bạn?{" "}
          <Button
            variant="link"
            className="font-medium text-crocus-600 hover:text-crocus-700 p-0"
            onClick={() => navigate("/auth/login")}
            disabled={isLoading}
          >
            Đăng nhập
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};