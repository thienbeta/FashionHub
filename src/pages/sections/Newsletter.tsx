import { useState } from "react";
import { Button } from "@/pages/ui/button";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập email của bạn." });
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Email không hợp lệ." });
      return;
    }

    // Giả sử gửi email thành công
    console.log("Gửi email đăng ký:", email);
    setMessage({ type: "success", text: "Đăng ký nhận tin thành công!" });
    setEmail("");
  };

  return (
    <section className="py-12 bg-crocus-50 rounded-xl">
      <div className="text-center max-w-xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Tin Tức</h2>
        <p className="text-gray-600 mb-6">
          Cập nhật các bộ sưu tập mới nhất và ưu đãi độc quyền
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-crocus-500"
          />
          <Button onClick={handleSubmit} className="bg-crocus-500 hover:bg-crocus-600">
            Đăng Ký
          </Button>
        </div>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
