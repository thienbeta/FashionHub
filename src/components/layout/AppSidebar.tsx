
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart,
  FileText,
  Archive,
  Settings,
  LogOut,
  HelpCircle,
  CreditCard,
  Megaphone,
  ChevronLeft,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarItemType {
  title: string;
  icon: any;
  path: string;
  badge?: string;
}

const staffItems: SidebarItemType[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/staff" },
  { title: "Products", icon: Package, path: "/staff/products" },
  { title: "Orders", icon: ShoppingCart, path: "/staff/orders", badge: "3" },
  { title: "Inventory", icon: Archive, path: "/staff/inventory" },
];

const adminItems: SidebarItemType[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Orders", icon: ShoppingCart, path: "/admin/orders", badge: "5" },
  { title: "Products", icon: Package, path: "/admin/products" },
  { title: "Customers", icon: Users, path: "/admin/users" },
  { title: "Analytics", icon: BarChart, path: "/admin/analytics" },
  { title: "Invoices", icon: FileText, path: "/admin/invoices" },
  { title: "Inventory", icon: Archive, path: "/admin/inventory" },
];

const adminManagementItems: SidebarItemType[] = [
  { title: "Payments", icon: CreditCard, path: "/admin/payments" },
  { title: "Marketing", icon: Megaphone, path: "/admin/marketing" },
  { title: "Staff", icon: Users, path: "/admin/staff" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

interface AppSidebarProps {
  role: "staff" | "admin";
}

export const AppSidebar = ({ role }: AppSidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const items = role === "staff" ? staffItems : adminItems;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar className="border-r border-gray-100 bg-white">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-crocus-500 flex items-center justify-center text-white font-semibold">
            {role === "staff" ? "S" : "A"}
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-gray-700">
              {role === "staff" ? "StaffPro" : "AdminPro"}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:bg-gray-100"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </SidebarHeader>

      <SidebarSeparator className="bg-gray-100" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn("text-gray-500 font-medium px-3 py-2", collapsed && "sr-only")}>
            MAIN
          </SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={collapsed ? item.title : undefined}
                  className={cn(
                    "my-1 transition-all rounded-md",
                    location.pathname === item.path
                      ? "bg-crocus-500 text-white font-medium"
                      : "text-gray-600 hover:bg-crocus-50 hover:text-crocus-600"
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-3 px-3 py-2">
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                    {item.badge && !collapsed && (
                      <span className="ml-auto bg-white bg-opacity-20 text-white text-xs rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {role === "admin" && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className={cn("text-gray-500 font-medium px-3 py-2", collapsed && "sr-only")}>
              MANAGEMENT
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminManagementItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={collapsed ? item.title : undefined}
                    className={cn(
                      "my-1 transition-all rounded-md",
                      location.pathname === item.path
                        ? "bg-crocus-500 text-white font-medium"
                        : "text-gray-600 hover:bg-crocus-50 hover:text-crocus-600"
                    )}
                  >
                    <Link to={item.path} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-gray-100 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip={collapsed ? "Help & Support" : undefined}
              className="hover:bg-crocus-50 hover:text-crocus-600 px-3 py-2 rounded-md mx-2"
            >
              <Link to="/help" className="flex items-center gap-3 text-gray-600">
                <HelpCircle className="h-5 w-5" />
                {!collapsed && <span>Help & Support</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip={collapsed ? "Logout" : undefined}
              className="hover:bg-crocus-50 hover:text-crocus-600 px-3 py-2 rounded-md mx-2"
            >
              <Link to="/logout" className="flex items-center gap-3 text-gray-600">
                <LogOut className="h-5 w-5" />
                {!collapsed && <span>Logout</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="p-4 text-xs text-center text-gray-400">
            Fashion Hub © 2025
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
