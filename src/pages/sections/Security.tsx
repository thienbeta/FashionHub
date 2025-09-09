import React from "react";
import { Shield, Lock, Eye, Users, Phone, MapPin, Mail, CheckCircle, } from "lucide-react";

const Security = () => {
  const sections = [
    {
      id: 1,
      title: "Mục đích thu nhập thông tin",
      icon: Mail,
      items: [
        "Nắm bắt được các yêu cầu, mong muốn của khách hàng nhằm nâng cao chất lượng sản phẩm.",
        "Giúp khách hàng cập nhật các thông tin chương trình khuyến mại, giảm giá do chúng tôi tổ chức sớm nhất.",
        "Hỗ trợ khách hàng khi có khiếu nại, ý kiến một cách nhanh nhất."
      ]
    },
    {
      id: 2,
      title: "Phạm vi thu nhập thông tin",
      icon: Users,
      items: [
        "Họ và Tên",
        "Địa Chỉ Email", 
        "Điện thoại",
        "Nội dung cần liên hệ"
      ]
    },
    {
      id: 3,
      title: "Phạm vi sử dụng thông tin",
      icon: Eye,
      items: [
        "Giao hàng cho quý khách đã mua hàng tại FashionHub",
        "Thông báo về việc giao hàng và hỗ trợ cho khách hàng",
        "Xử lý các đơn đặt hàng và cung cấp sản phẩm thông qua website: FashionHub",
        "Lưu trữ thông tin giao dịch để giải quyết các vấn đề có thể phát sinh"
      ]
    }
  ];

  const Target = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-red-600/10"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-red-500 rounded-2xl shadow-xl mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
              Chính Sách Bảo Mật
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Thông tin chi tiết về cách chúng tôi bảo vệ và quản lý dữ liệu cá nhân của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16">
        {/* Introduction Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-purple-100/50 hover:shadow-3xl transition-all duration-500">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Nhằm đảm bảo an toàn cho website và bảo mật thông tin cho người tiêu dùng, chúng tôi đưa ra một số chính sách bảo mật thông tin cho khách hàng cá nhân và tổ chức khi mua hàng tại website: <span className="font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">FashionHub</span>
            </p>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của bạn. Chính sách cũng sẽ giải thích các bước chúng tôi thực hiện để bảo mật thông tin cá nhân của khách hàng.
            </p>
            <div className="bg-gradient-to-r from-purple-500/10 to-red-500/10 rounded-2xl p-6 border-l-4 border-purple-500">
              <p className="text-gray-700 font-medium text-lg">
                Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho bạn là vấn đề rất quan trọng với công ty. Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="grid gap-8 mb-12">
          {sections.map((section, index) => (
            <div key={section.id} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-red-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                    <section.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                    {section.id}. {section.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start group/item">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-red-500 rounded-full mt-2 mr-4 group-hover/item:scale-125 transition-transform duration-200"></div>
                      <p className="text-gray-700 leading-relaxed group-hover/item:text-gray-800 transition-colors duration-200">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Sharing Policy */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-red-100/50 hover:shadow-3xl transition-all duration-500">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              Chính sách chia sẻ thông tin
            </h3>
          </div>
          <p className="text-gray-700 mb-4 text-lg">Chúng tôi sẽ không chia sẻ thông tin khách hàng trừ các trường hợp:</p>
          <div className="space-y-3">
            {[
              "Để bảo vệ FashionHub và các bên thứ ba khác nếu phù hợp với pháp luật",
              "Theo yêu cầu pháp lý từ cơ quan chính phủ khi cần thiết"
            ].map((item, index) => (
              <div key={index} className="flex items-start group/item">
                <CheckCircle className="h-5 w-5 text-red-500 mt-1 mr-3 group-hover/item:scale-110 transition-transform duration-200" />
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Security Commitment */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                4. Cam kết bảo mật thông tin
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi sẽ lưu trữ các thông tin cá nhân do khách hàng cung cấp trên hệ thống nội bộ trong quá trình cung cấp sản phẩm, cho đến khi hoàn thành mục đích thu thập hoặc khách yêu cầu hủy thông tin đã cung cấp.
            </p>
          </div>

          {/* Access Control */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                5. Quyền truy cập thông tin
              </h3>
            </div>
            <div className="space-y-3">
              {[
                "Chỉ sử dụng với sự đồng ý của khách hàng",
                "Không cung cấp cho bên thứ 3 nếu không được sự đồng ý",
                "Chỉ cung cấp trong trường hợp có lợi và được phép",
                "Hoặc theo yêu cầu từ cơ quan chính phủ"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-purple-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-purple-100/50 hover:shadow-3xl transition-all duration-500">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl mr-6">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent mb-2">
                6. Thông tin đơn vị thu thập và quản lý
              </h3>
              <p className="text-gray-600">Địa chỉ liên hệ chính thức của chúng tôi</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-red-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <h4 className="font-bold text-purple-700 mb-2">Tên đơn vị:</h4>
                <p className="text-gray-700">Hộ kinh doanh FashionHub - Buôn Mê Thuột</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-red-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <h4 className="font-bold text-purple-700 mb-2">GPKD:</h4>
                <p className="text-gray-700">Số 55555555 do Ủy ban nhân dân TP. Buôn Mê Thuột</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-red-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <h4 className="font-bold text-purple-700 mb-2">Cấp ngày:</h4>
                <p className="text-gray-700">5 tháng 5 năm 2025</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-6 bg-gradient-to-r from-red-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <MapPin className="h-6 w-6 text-red-500 mr-4 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <h4 className="font-bold text-red-700 mb-1">Địa chỉ:</h4>
                  <p className="text-gray-700">123 Hà Huy Tập, TP. Buôn Mê Thuột, Đắk Lắk</p>
                </div>
              </div>
              <div className="flex items-center p-6 bg-gradient-to-r from-red-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Phone className="h-6 w-6 text-red-500 mr-4 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <h4 className="font-bold text-red-700 mb-1">Điện thoại:</h4>
                  <p className="text-gray-700">0383.777.823</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Rights Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-red-100/50 hover:shadow-3xl transition-all duration-500">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <Eye className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              7. Quyền truy cập và chỉnh sửa dữ liệu
            </h3>
          </div>
          <div className="bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-2xl p-6 border border-red-200/50">
            <p className="text-gray-700 text-lg leading-relaxed">
              Khách hàng có thể thực hiện các quyền trên bằng cách liên hệ với chúng tôi qua số điện thoại hoặc địa chỉ liên lạc được công bố trên website: <span className="font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">FashionHub</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;