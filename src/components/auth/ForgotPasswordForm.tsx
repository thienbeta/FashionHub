
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
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
      setError("Email is required");
      return;
    }
    
    // Simulate API call to send OTP
    console.log("Sending OTP to:", email);
    setError("");
    setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp) {
      setError("OTP is required");
      return;
    }
    
    // Simulate OTP verification
    console.log("Verifying OTP:", otp);
    setError("");
    setStep("newPassword");
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError("New password is required");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Simulate password reset
    console.log("Resetting password");
    setError("");
    // Redirect to login page or show success message
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {step === "email" && "Forgot Password"}
          {step === "otp" && "Enter Verification Code"}
          {step === "newPassword" && "Set New Password"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === "email" && "Enter your email to receive a reset link"}
          {step === "otp" && "Enter the verification code sent to your email"}
          {step === "newPassword" && "Create a new secure password"}
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
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-crocus-500 hover:bg-crocus-600">
              <KeyRound className="mr-2 h-4 w-4" /> Send Reset Link
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full bg-crocus-500 hover:bg-crocus-600">
              Verify Code
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-crocus-600 hover:text-crocus-700 flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="mr-1 h-3 w-3" /> Back to email
              </button>
            </div>
          </form>
        )}

        {step === "newPassword" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
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
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
              Reset Password
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link to="/auth/login" className="font-medium text-crocus-600 hover:text-crocus-700">
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
