import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, Package, Folder, Users, Settings, Shield } from "lucide-react";
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
  description?: string;
}

// ---------- Menu Data ----------
const adminItems: SidebarItemType[] = [
  { 
    title: "Trang Chủ", 
    icon: LayoutDashboard, 
    path: "/admin", 
    color: "text-red-600",
    description: "Bảng điều khiển chính"
  },
  { 
    title: "Sản Phẩm", 
    icon: Package, 
    path: "/admin/sanpham", 
    color: "text-red-600",
    description: "Quản lý sản phẩm"
  },
  { 
    title: "Danh Mục", 
    icon: Folder, 
    path: "/admin/danhmuc", 
    color: "text-purple-600",
    description: "Phân loại sản phẩm"
  },
  { 
    title: "Người Dùng", 
    icon: Users, 
    path: "/admin/nguoidung", 
    color: "text-red-600",
    description: "Quản lý tài khoản"
  },
];

const supportItems: SidebarItemType[] = [
  { 
    title: "Cài Đặt", 
    icon: Settings, 
    path: "/admin/settings", 
    color: "text-purple-600",
    description: "Cấu hình hệ thống"
  },
  { 
    title: "Bảo Mật", 
    icon: Shield, 
    path: "/admin/profile", 
    color: "text-red-600",
    description: "Quản lý bảo mật"
  },
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
    <div className={cn(
      "p-4 flex items-center border-b border-purple-100 bg-gradient-to-r from-purple-50 to-red-50 shadow-sm",
      className
    )}>
      <div
        className={cn(
          "flex items-center w-full",
          collapsed && !showText ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && showText && (
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-red-600 rounded-xl shadow-lg flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                Fashion Admin
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Quản trị hệ thống
              </span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded-lg shadow-sm transition-all duration-200"
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
  collapsed,
  color,
  description,
}: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  const showText = !collapsed || (collapsed && (isMobile || isTablet));

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-purple-600 to-red-600 text-white"
          : "text-gray-700 hover:bg-purple-50 hover:text-purple-700",
        collapsed && !showText ? "justify-center" : ""
      )}
    >
      <Icon className={cn("h-5 w-5", isActive ? "text-white" : color)} />
      {showText && (
        <div className="flex-1 min-w-0 flex flex-col">
          <span className={cn("text-sm font-medium", isActive ? "text-white" : "text-gray-800")}>
            {title}
          </span>
          {description && !isActive && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
      )}
    </Link>
  );
};

// ---------- SidebarSection ----------
interface SidebarSectionProps {
  title: string;
  items: SidebarItemType[];
  collapsed: boolean;
}

const SidebarSection = ({ title, items, collapsed }: SidebarSectionProps) => (
  <SidebarGroup className={cn("mt-4", collapsed ? "px-2" : "px-3")}>
    {!collapsed && (
      <SidebarGroupLabel className="text-gray-600 font-bold px-3 py-2 text-xs uppercase tracking-wider">
        {title}
      </SidebarGroupLabel>
    )}
    <SidebarMenu className="space-y-1 mt-2">
      {items.map((item) => (
        <SidebarMenuItem key={item.path} className={collapsed ? "px-0 w-full flex justify-center" : ""}>
          <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
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
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 left-0 z-30 flex flex-col transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-white via-purple-50/30 to-red-50/30",
        "border-r border-purple-200/50 shadow-md",
        isCollapsed || isMobile ? "w-[70px]" : isTablet ? "w-[200px]" : "w-[250px]"
      )}
    >
      <SidebarHeader
        role="admin"
        collapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      
      <nav className="flex-1 px-3 py-4 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
        {[
          { label: "Menu Chính", items: adminItems },
          { label: "Hỗ Trợ", items: supportItems },
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