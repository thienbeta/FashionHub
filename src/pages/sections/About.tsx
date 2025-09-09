import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/pages/ui/card";
import { Button } from "@/pages/ui/button";
import { MapPin, Mail, Phone, Users, Target, Eye } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
              Về Chúng Tôi
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-700 mt-8 max-w-3xl mx-auto leading-relaxed">
            Khám phá câu chuyện về sứ mệnh, tầm nhìn và đội ngũ tài năng đằng sau thương hiệu của chúng tôi
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
          <CardHeader className="pb-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-red-500 rounded-full"></div>
                </div>
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                Câu Chuyện Của Chúng Tôi
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Được thành lập với niềm đam mê về thời trang và cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Mission, Vision, Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center h-full">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-8 w-8 text-purple-600 group-hover:text-red-500 transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                    Sứ Mệnh
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Mang đến những sản phẩm thời trang chất lượng cao với giá cả hợp lý, giúp mọi người tự tin thể hiện phong cách riêng của mình.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center h-full">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Eye className="h-8 w-8 text-purple-600 group-hover:text-red-500 transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                    Tầm Nhìn
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Trở thành thương hiệu thời trang hàng đầu tại Việt Nam, được khách hàng tin tưởng và yêu thích.
                  </p>
                </div>
              </div>

              {/* Team Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center h-full">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-purple-600 group-hover:text-red-500 transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                    Đội Ngũ
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Đội ngũ chuyên nghiệp với nhiều năm kinh nghiệm trong ngành thời trang và phục vụ khách hàng.
                  </p>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-gradient-to-r from-purple-500/10 to-red-500/10 rounded-3xl p-8 mb-12 border border-purple-200/50">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                Giá Trị Cốt Lõi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Chất Lượng", desc: "Cam kết chất lượng sản phẩm cao cấp" },
                  { title: "Sáng Tạo", desc: "Thiết kế độc đáo, xu hướng thời trang mới" },
                  { title: "Uy Tín", desc: "Xây dựng lòng tin với khách hàng" },
                  { title: "Phục Vụ", desc: "Dịch vụ khách hàng tận tâm, chu đáo" }
                ].map((value, index) => (
                  <div key={index} className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <h4 className="font-bold text-lg mb-2 text-purple-700">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                Liên Hệ Với Chúng Tôi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-red-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group">
                  <MapPin className="h-6 w-6 text-purple-600 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Địa chỉ</h4>
                    <p className="text-sm text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-red-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group">
                  <Phone className="h-6 w-6 text-purple-600 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Điện thoại</h4>
                    <p className="text-sm text-gray-600">(+84) 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-red-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group">
                  <Mail className="h-6 w-6 text-purple-600 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-sm text-gray-600">info@fashion.com</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;