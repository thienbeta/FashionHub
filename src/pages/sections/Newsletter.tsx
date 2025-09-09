import { useState } from "react";
import { Button } from "@/pages/ui/button";
import { Mail, Send, CheckCircle, AlertCircle, Sparkles, Gift, Zap } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập email của bạn." });
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Email không hợp lệ." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      console.log("Gửi email đăng ký:", email);
      setMessage({ type: "success", text: "Đăng ký nhận tin thành công! Kiểm tra email để xác nhận." });
      setEmail("");
      setIsSubmitting(false);
      setIsSubscribed(true);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-8xl mx-auto">
          {!isSubscribed ? (

            <div className="bg-white/95 backdrop-blur-lg�

            rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200">
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-red-500 rounded-full shadow-xl mb-6">
                  <Mail className="h-10 w-10 text-white" />
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600 mb-4 leading-tight">
                  Đăng Ký Nhận Tin Tức
                </h2>

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Cập nhật các bộ sưu tập mới nhất, ưu đãi độc quyền và xu hướng thời trang 2025
                </p>
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-purple-700 mb-2">Sản phẩm mới</h3>
                  <p className="text-sm text-gray-600">Cập nhật ngay khi có sản phẩm mới</p>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-2xl border border-red-200 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-red-700 mb-2">Ưu đãi đặc biệt</h3>
                  <p className="text-sm text-gray-600">Giảm giá độc quyền cho thành viên</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-red-50 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600 mb-2">Xu hướng mới</h3>
                  <p className="text-sm text-gray-600">Thông tin thời trang hot nhất</p>
                </div>
              </div>

              {/* Email Input Section */}
              <div className="bg-gradient-to-r from-purple-50/50 to-red-50/50 p-6 rounded-2xl border border-purple-200 shadow-inner">
                <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto w-full">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <input
                      type="email"
                      placeholder="Nhập email của bạn..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 placeholder:text-gray-400"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 
                              text-white px-12 py-8 text-xl rounded-2xl shadow-2xl 
                              hover:shadow-3xl transition-all duration-200 hover:scale-105 
                              disabled:hover:scale-100 disabled:opacity-70 border-0"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đăng ký...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Send className="h-6 w-6" />
                        <span>Đăng Ký</span>
                      </div>
                    )}
                  </Button>

                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`mt-6 p-4 rounded-xl border shadow-lg transition-all duration-300 ${message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {message.type === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-lg font-medium">{message.text}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Success State */
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-gray-200 text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>

              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600 mb-4">
                Chào mừng bạn đến với gia đình! 🎉
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
                Bạn sẽ nhận được những thông tin mới nhất về thời trang và ưu đãi độc quyền trong email của mình.
              </p>

              <Button
                onClick={() => {
                  setIsSubscribed(false);
                  setMessage(null);
                }}
                className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
              >
                <Mail className="mr-2 h-5 w-5" />
                Đăng ký email khác
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;