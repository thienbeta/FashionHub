
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import { SidebarInset } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  role: "staff" | "admin";
}

const getPageTitle = (pathname: string): string => {
  const pathParts = pathname.split("/");
  const page = pathParts[2] || "dashboard";
  const titles = {
    dashboard: "Bảng điều khiển",
    orders: "Đơn hàng",
    products: "Sản phẩm",
    inventory: "Kho hàng",
    users: "Người dùng",
    staff: "Nhân viên",
    settings: "Cài đặt",
    invoices: "Hóa đơn",
    form: "Form",
    contact: "Liên hệ",
    marketing: "Tiếp thị",
    messages: "Tin nhắn",
    chat: "Trò chuyện",
    calendar: "Lịch",
    reports: "Báo cáo",
    payments: "Thanh toán",
    favorites: "Yêu thích",
    website: "Trang web",
    security: "Bảo mật",
    trademark: "Thương hiệu",
    type: "Loại sản phẩm",
    subcategories: "Danh mục con",
    purchaseOrders: "Đơn đặt hàng",
    shipping: "Danh Mục",
    categories: "Danh mục",
    blogs: "Blog",
  };
  return titles[page] || page.charAt(0).toUpperCase() + page.slice(1);
};

const AdminLayout = ({ role }: AdminLayoutProps) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState(getPageTitle(location.pathname));
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/admin" && !sessionStorage.getItem("welcomed")) {
      setTimeout(() => {
        toast.success("Chào mừng đến với FashionHub Admin", {
          description: "Bảng điều khiển quản lý bán hàng mạnh mẽ của bạn",
          duration: 5000,
        });
        sessionStorage.setItem("welcomed", "true");
      }, 1000);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AppSidebar role={role} />
      <SidebarInset className="flex flex-col min-h-screen flex-1 min-w-0">
        <Header title={pageTitle} />
        <main className="flex-1 overflow-auto">
          <div className="p-2 sm:p-4 md:p-6 h-full">
            {isPageLoading ? (
              <div className="h-full w-full flex items-center justify-center min-h-[40vh]">
                <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-t-crocus-500 border-crocus-200 animate-spin"></div>
              </div>
            ) : (
              <div className="animate-fade-in w-full h-full">
                <Outlet />
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default AdminLayout;
