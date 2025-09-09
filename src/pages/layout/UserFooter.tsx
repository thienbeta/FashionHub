import {
    LayoutGrid,
    ShoppingBag,
    UserCircle,
    Package,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
} from "lucide-react";
import Translate from "../user/Translate";

const UserFooter = () => {
    return (
        <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-red-900 border-t-4 border-purple-400 py-12 shadow-2xl relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-red-600/10"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Logo Section */}
                    <div className="text-center md:text-left">
                        <a href="/" className="flex items-center justify-center md:justify-start gap-2" aria-label="Trang chủ">
                            <div className="bg-gradient-to-br from-white to-purple-100 p-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                                <img
                                    src="/logo.png"
                                    alt={import.meta.env.VITE_TITLE}
                                    className="h-24 w-auto filter drop-shadow-lg"
                                />
                            </div>
                        </a>
                        <p className="text-purple-100 mt-4 text-lg leading-relaxed font-medium shadow-sm">
                            Mang đến cho bạn những xu hướng thời trang mới nhất 2025.
                        </p>
                        <div className="mt-4 h-1 w-20 bg-gradient-to-r from-purple-400 to-red-400 rounded-full mx-auto md:mx-0 shadow-lg"></div>
                    </div>

                    {/* Shopping Section */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <h3 className="font-bold text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-red-200 flex items-center gap-2">
                            <ShoppingBag className="h-6 w-6 text-purple-300" />
                            Mua sắm
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="/" className="text-purple-100 hover:text-white text-lg flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group">
                                    <LayoutGrid className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" /> 
                                    <span className="group-hover:translate-x-1 transition-transform">Trang chủ</span>
                                </a>
                            </li>
                            <li>
                                <a href="/products" className="text-purple-100 hover:text-white text-lg flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group">
                                    <ShoppingBag className="h-5 w-5 text-red-300 group-hover:text-red-200 transition-colors" /> 
                                    <span className="group-hover:translate-x-1 transition-transform">Sản phẩm</span>
                                </a>
                            </li>
                            <li>
                                <a href="/profile" className="text-purple-100 hover:text-white text-lg flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group">
                                    <UserCircle className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" /> 
                                    <span className="group-hover:translate-x-1 transition-transform">Hồ sơ</span>
                                </a>
                            </li>
                            <li className="pt-2">
                                <div className="bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-lg p-2 shadow-inner">
                                    <Translate />
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Account Section */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <h3 className="font-bold text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-purple-200 flex items-center gap-2">
                            <UserCircle className="h-6 w-6 text-red-300" />
                            Tài khoản
                        </h3>
                        <ul className="space-y-4 mb-8">
                            <li>
                                <a href="/Security" className="text-purple-100 hover:text-white text-lg flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group">
                                    <Package className="h-5 w-5 text-red-300 group-hover:text-red-200 transition-colors" /> 
                                    <span className="group-hover:translate-x-1 transition-transform">Bảo mật</span>
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-purple-100 hover:text-white text-lg flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group">
                                    <MapPin className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" /> 
                                    <span className="group-hover:translate-x-1 transition-transform">Về chúng tôi</span>
                                </a>
                            </li>
                        </ul>
                        
                        {/* Social Media Icons */}
                        <div className="border-t border-white/20 pt-6">
                            <p className="text-purple-200 text-sm mb-4 font-medium">Kết nối với chúng tôi:</p>
                            <div className="flex justify-center md:justify-start space-x-4">
                                <a href="#" 
                                   className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group" 
                                   aria-label="Facebook">
                                    <Facebook className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                                </a>
                                <a href="#" 
                                   className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group" 
                                   aria-label="Instagram">
                                    <Instagram className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                                </a>
                                <a href="#" 
                                   className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group" 
                                   aria-label="Twitter">
                                    <Twitter className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default UserFooter;