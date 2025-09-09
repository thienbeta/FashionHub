
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";
import { Button } from "@/pages/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Menu,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  Heart,
  MessageSquare,
  LayoutGrid,
  Mail,
  ShoppingBag,
  UserCircle,
  Package,
  Instagram,
  Twitter,
  Facebook,
  MapPin,
  Bell,
  Settings as SettingsIcon,
  Star,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/pages/ui/navigation-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/pages/ui/drawer";
import Search from "@/pages/user/Search";
import UserFooter from "@/pages/layout/UserFooter";

const UserLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("userId"));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const navLinks = [
    { title: "TRANG CHỦ", path: "/", icon: <LayoutGrid className="h-5 w-5" /> },
    { title: "SẢN PHẨM", path: "/products", icon: <ShoppingBag className="h-5 w-5" /> },
  ];

  useEffect(() => {
    // Check login status on mount
    setIsLoggedIn(!!sessionStorage.getItem("userId"));

    // Handle click outside for user menu
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear all session and local storage
      sessionStorage.clear();
      localStorage.clear();
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      
      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Đăng xuất thành công",
        text: "Bạn đã đăng xuất khỏi hệ thống!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/auth/login");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Đã có lỗi xảy ra khi đăng xuất",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Enhanced Header with Purple & Red Theme */}
      <header className="bg-gradient-to-r from-purple-900 via-purple-700 to-red-600 border-b border-purple-300/30 sticky top-0 z-40 shadow-xl shadow-purple-500/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 group" aria-label="Trang chủ">
              <div className="bg-white/20 rounded-lg p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 backdrop-blur-sm border border-white/30">
                <img
                  src="/logo.png"
                  alt={import.meta.env.VITE_TITLE}
                  className="h-8 w-32 object-contain filter brightness-0 invert"
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.path}>
                    <a href={link.path}>
                      <NavigationMenuLink
                        className={cn(
                          "px-4 sm:px-6 py-3 rounded-lg font-medium text-gray-900 uppercase transition-all duration-200 flex items-center gap-2 hover:bg-white/20 shadow-md hover:shadow-lg backdrop-blur-sm border border-white/20 hover:border-white/40",
                          location.pathname === link.path && "bg-white/30 text-gray-900 font-semibold border-white/50 shadow-lg"
                        )}
                      >
                        {link.icon}
                        <span>{link.title}</span>
                      </NavigationMenuLink>
                    </a>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search - Desktop */}
            <div className="hidden lg:block">
              <Search />
            </div>

            {/* Search - Mobile/Tablet */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => navigate("/search")}
                aria-label="Tìm kiếm"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </div>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => navigate("/favourites")}
              aria-label="Yêu thích"
            >
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => navigate("/")}
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Drawer>
              <DrawerTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Mở menu"
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-gradient-to-b from-purple-50 to-red-50 border-t-4 border-purple-500 max-h-[80vh]">
                <div className="p-4 sm:p-6 pt-4 overflow-y-auto">
                  <div className="flex flex-col gap-3 py-4">
                    {navLinks.map((link) => (
                      <DrawerClose key={link.path} asChild>
                        <a
                          href={link.path}
                          className={cn(
                            "flex items-center gap-3 px-4 sm:px-6 py-4 rounded-xl text-base font-medium uppercase text-gray-900 transition-all duration-200 shadow-md hover:shadow-lg border",
                            location.pathname === link.path
                              ? "bg-gradient-to-r from-purple-500 to-red-500 text-white border-purple-400 shadow-lg shadow-purple-500/25"
                              : "bg-white text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-red-50 border-purple-200 hover:border-purple-300"
                          )}
                          aria-label={link.title}
                        >
                          {link.icon}
                          <span>{link.title}</span>
                        </a>
                      </DrawerClose>
                    ))}
                    {isLoggedIn && (
                      <>
                        <DrawerClose asChild>
                          <a
                            href="/profile"
                            className="flex items-center gap-3 px-4 sm:px-6 py-4 rounded-xl text-base font-medium uppercase text-gray-900 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-red-50 border border-purple-200 hover:border-purple-300 shadow-md hover:shadow-lg"
                            aria-label="Hồ sơ cá nhân"
                          >
                            <UserCircle className="h-5 w-5" />
                            <span>HỒ SƠ CÁ NHÂN</span>
                          </a>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <a
                            href="/favourites"
                            className="flex items-center gap-3 px-4 sm:px-6 py-4 rounded-xl text-base font-medium uppercase text-gray-900 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-red-50 border border-purple-200 hover:border-purple-300 shadow-md hover:shadow-lg"
                            aria-label="Yêu thích"
                          >
                            <Heart className="h-5 w-5" />
                            <span>YÊU THÍCH</span>
                          </a>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <a
                            href="/"
                            className="flex items-center gap-3 px-4 sm:px-6 py-4 rounded-xl text-base font-medium uppercase text-gray-900 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-red-50 border border-purple-200 hover:border-purple-300 shadow-md hover:shadow-lg"
                            aria-label="Giỏ hàng"
                          >
                            <ShoppingCart className="h-5 w-5" />
                            <span>GIỎ HÀNG</span>
                          </a>
                        </DrawerClose>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-3 px-4 sm:px-6 py-4 rounded-xl text-base font-medium uppercase text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300 shadow-md hover:shadow-lg"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                        >
                          <LogOut className="h-5 w-5" />
                          <span>{isLoggingOut ? "ĐANG ĐĂNG XUẤT..." : "ĐĂNG XUẤT"}</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* User Authentication */}
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Menu người dùng"
                  disabled={isLoggingOut}
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <User className="h-5 w-5" />
                </Button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 sm:w-72 bg-white/95 backdrop-blur-lg border border-purple-200/50 rounded-xl shadow-2xl shadow-purple-500/25 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-red-500 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full p-2 shadow-lg">
                          <UserCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base uppercase">TÀI KHOẢN CỦA TÔI</h3>
                          <p className="text-sm text-purple-100">
                            {sessionStorage.getItem("taiKhoan") || "Người dùng"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Menu Items */}
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full text-left justify-start text-gray-900 uppercase hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-lg mb-1 font-medium shadow-sm hover:shadow-md"
                        onClick={() => {
                          navigate("/profile");
                          setIsUserMenuOpen(false);
                        }}
                        disabled={isLoggingOut}
                      >
                        <UserCircle className="h-5 w-5 mr-3 text-purple-500" />
                        <span>HỒ SƠ CÁ NHÂN</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full text-left justify-start text-gray-900 uppercase hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-lg mb-1 font-medium shadow-sm hover:shadow-md"
                        onClick={() => {
                          navigate("/favourites");
                          setIsUserMenuOpen(false);
                        }}
                        disabled={isLoggingOut}
                      >
                        <Heart className="h-5 w-5 mr-3 text-purple-500" />
                        <span>YÊU THÍCH</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full text-left justify-start text-gray-900 uppercase hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-lg mb-1 font-medium shadow-sm hover:shadow-md"
                        onClick={() => {
                          navigate("/");
                          setIsUserMenuOpen(false);
                        }}
                        disabled={isLoggingOut}
                      >
                        <ShoppingCart className="h-5 w-5 mr-3 text-purple-500" />
                        <span>GIỎ HÀNG</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full text-left justify-start text-red-600 uppercase hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-lg font-medium shadow-sm hover:shadow-md"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>{isLoggingOut ? "ĐANG ĐĂNG XUẤT..." : "ĐĂNG XUẤT"}</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-gray-900 uppercase border-white/30 bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
                onClick={() => navigate("/auth/login")}
                aria-label="Đăng nhập"
              >
                <LogIn className="h-4 w-4 mr-2" />
                ĐĂNG NHẬP
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="flex-1 bg-gradient-to-br from-purple-50/30 via-white to-red-50/30 min-h-screen">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-500/10 border border-purple-100/50 p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <UserFooter />
    </>
  );
};

export default UserLayout;
