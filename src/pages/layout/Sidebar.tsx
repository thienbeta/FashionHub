import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, Package, ShoppingCart, BarChart, FileText, Archive, Settings, HelpCircle, CreditCard, Megaphone, MessageSquare, Calendar, Globe, Shield, Heart, ClipboardList } from "lucide-react";
import { TruckIcon as Truck, TagIcon as Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/pages/ui/tooltip";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/pages/ui/sidebar";
import { Button } from "@/pages/ui/button";

// ---------- Sidebar Item Types ----------
interface SidebarItemType {
  title: string;
  icon: React.ElementType;
  path: string;
  color: string;
  badge?: string;
}

// ---------- Menu Data ----------
const adminItems: SidebarItemType[] = [
  { title: "Bảng điều khiển", icon: LayoutDashboard, path: "/admin", color: "text-blue-600" },
  { title: "Đơn hàng", icon: ShoppingCart, path: "/admin/orders", badge: "5", color: "text-orange-600" },
  { title: "Sản phẩm", icon: Package, path: "/admin/products", color: "text-green-600" },
  { title: "Người dùng", icon: Users, path: "/admin/users", color: "text-red-600" },
  { title: "Nhân viên", icon: Users, path: "/admin/staff", color: "text-red-600" },
  { title: "Phân tích", icon: BarChart, path: "/admin/analytics", color: "text-cyan-600" },
  { title: "Hóa đơn", icon: FileText, path: "/admin/invoices", color: "text-gray-600" },
  { title: "Kho hàng", icon: Archive, path: "/admin/inventory", color: "text-purple-600" },
  { title: "Blog", icon: Calendar, path: "/admin/blogs", color: "text-red-600" },
];

const adminManagementItems: SidebarItemType[] = [
  { title: "Thanh toán", icon: CreditCard, path: "/admin/payments", color: "text-yellow-600" },
  { title: "Tiếp thị", icon: Megaphone, path: "/admin/marketing", color: "text-pink-600" },
  { title: "Tin nhắn", icon: MessageSquare, path: "/admin/messages", color: "text-blue-600" },
  { title: "Trò chuyện", icon: MessageSquare, path: "/admin/chat", color: "text-teal-600" },
  { title: "Lịch", icon: Calendar, path: "/admin/calendar", color: "text-green-600" },
  { title: "Báo cáo", icon: BarChart, path: "/admin/reports", color: "text-cyan-600" },
];

const supportItems: SidebarItemType[] = [
  { title: "Cài đặt", icon: Settings, path: "/admin/settings", color: "text-gray-600" },
  { title: "Liên hệ", icon: HelpCircle, path: "/admin/contact", color: "text-blue-600" },
  { title: "Yêu thích", icon: Heart, path: "/admin/favorites", color: "text-red-600" },
  { title: "Trang web", icon: Globe, path: "/admin/website", color: "text-green-600" },
  { title: "Bảo mật", icon: Shield, path: "/admin/security", color: "text-purple-600" },
];

const categoryItems: SidebarItemType[] = [
  { title: "Loại sản phẩm", icon: Tag, path: "/admin/type", color: "text-pink-600" },
  { title: "Danh mục con", icon: ClipboardList, path: "/admin/subcategories", color: "text-teal-600" },
  { title: "Thương hiệu", icon: CreditCard, path: "/admin/trademark", color: "text-pink-600" },
];

// ---------- SidebarHeader ----------
interface SidebarHeaderProps {
  role: "admin";
  collapsed: boolean;
  toggleCollapse: () => void;
  className?: string;
}

const SidebarHeader = ({
  role,
  collapsed,
  toggleCollapse,
  className,
}: SidebarHeaderProps) => {
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  const showText = !collapsed || (collapsed && (isMobile || isTablet));

  return (
    <div className={cn("p-3 flex items-center border-b border-gray-200", className)}>
      <div
        className={cn(
          "flex items-center w-full",
          collapsed && !showText ? "justify-center" : "justify-between"
        )}
      >
        <Link to="/admin" className="flex items-center gap-2">
          {showText && (
            <div className="flex flex-col h-10 items-center justify-center">
              <img src="/logo.gif" alt="DearMoment" className="h-32 w-auto max-w-[300px]" />
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="text-gray-500 hover:text-crocus-600 hover:bg-crocus-50"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
    </div>
  );
};

// ---------- SidebarItem ----------
interface SidebarItemProps extends SidebarItemType {
  collapsed: boolean;
}

const SidebarItem = ({
  title,
  icon: Icon,
  path,
  badge,
  collapsed,
  color,
}: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  const showText = !collapsed || (collapsed && (isMobile || isTablet));

  const linkContent = (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors",
        isActive
          ? "bg-crocus-100 text-crocus-600 font-medium"
          : "text-gray-600 hover:bg-crocus-50 hover:text-crocus-600"
      )}
    >
      <div className={cn("relative flex items-center justify-center", collapsed && !showText ? "w-full" : "w-auto")}>
        <Icon className={cn("h-5 w-5", isActive ? "text-crocus-600" : color)} />
        {badge && collapsed && !showText && (
          <span className="absolute -top-2 -right-2 bg-crocus-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      {showText && (
        <>
          <span className="text-sm truncate">{title}</span>
          {badge && (
            <span className="ml-auto bg-crocus-100 text-crocus-600 text-xs rounded-full px-2 py-0.5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed && !isMobile && !isTablet) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">{linkContent}</div>
        </TooltipTrigger>
        <TooltipContent side="right" className="z-50 bg-white border border-gray-100 shadow-md">
          {title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
};

// ---------- SidebarSection ----------
interface SidebarSectionProps {
  title: string;
  items: SidebarItemType[];
  collapsed: boolean;
}

const SidebarSection = ({ title, items, collapsed }: SidebarSectionProps) => (
  <SidebarGroup className={cn("mt-4", collapsed ? "px-1" : "px-2")}>
    {!collapsed && (
      <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-2 text-xs uppercase">
        {title}
      </SidebarGroupLabel>
    )}
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.path}
          className={cn(collapsed ? "px-0 w-full flex justify-center" : "")}
        >
          <SidebarMenuButton
            asChild
            tooltip={collapsed ? item.title : undefined}
            className={cn("my-1 transition-all rounded-md", collapsed ? "w-full" : "")}
          >
            <SidebarItem {...item} collapsed={collapsed} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroup>
);

// ---------- Sidebar ----------
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={cn(
        "h-screen bg-white sticky top-0 left-0 z-30 flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <SidebarHeader
        role="admin"
        collapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {[
          { label: "Menu Chính", items: adminItems },
          { label: "Danh mục", items: categoryItems },
          { label: "Quản lý", items: adminManagementItems },
          { label: "Hỗ trợ", items: supportItems },
        ].map((section) => (
          <SidebarSection
            key={section.label}
            title={section.label}
            items={section.items}
            collapsed={isCollapsed}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
