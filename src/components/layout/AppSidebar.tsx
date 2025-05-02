
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
  MessageSquare,
  Calendar,
  Globe,
  Shield,
  Heart,
  ClipboardList,
  TruckIcon,
  TagIcon,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarItemType {
  title: string;
  icon: any;
  path: string;
  badge?: string;
}

// Main menu items
const staffItems: SidebarItemType[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/staff" },
  { title: "Products", icon: Package, path: "/staff/products" },
  { title: "Orders", icon: ShoppingCart, path: "/staff/orders", badge: "3" },
  { title: "Inventory", icon: Archive, path: "/staff/inventory" },
  { title: "Purchase Orders", icon: ClipboardList, path: "/staff/purchase-orders" },
  { title: "Shipping", icon: TruckIcon, path: "/staff/shipping" },
  { title: "Categories", icon: TagIcon, path: "/staff/categories" },
];

const adminItems: SidebarItemType[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Orders", icon: ShoppingCart, path: "/admin/orders", badge: "5" },
  { title: "Products", icon: Package, path: "/admin/products" },
  { title: "Customers", icon: Users, path: "/admin/users" },
  { title: "Analytics", icon: BarChart, path: "/admin/analytics" },
  { title: "Invoices", icon: FileText, path: "/admin/invoices" },
];

// Marketing and communications items
const adminManagementItems: SidebarItemType[] = [
  { title: "Payments", icon: CreditCard, path: "/admin/payments" },
  { title: "Marketing", icon: Megaphone, path: "/admin/marketing" },
  { title: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { title: "Chat", icon: MessageSquare, path: "/admin/chat" },
  { title: "Calendar", icon: Calendar, path: "/admin/calendar" },
  { title: "Reports", icon: BarChart, path: "/admin/reports" },
];

// Support items
const supportItems: SidebarItemType[] = [
  { title: "Settings", icon: Settings, path: "/admin/settings" },
  { title: "Help Center", icon: HelpCircle, path: "/admin/help" },
  { title: "Favorites", icon: Heart, path: "/admin/favorites" },
  { title: "Website", icon: Globe, path: "/admin/website" },
  { title: "Security", icon: Shield, path: "/admin/security" },
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
          <div className="h-12 w-12 rounded-md bg-purple-400 flex items-center justify-center text-white text-lg font-semibold">
            {role === "staff" ? "S" : "A"}
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-gray-700">
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
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </SidebarHeader>

      <SidebarSeparator className="bg-gray-100" />

      <SidebarContent className="px-3">
        <SidebarGroup>
          {!collapsed && role === "admin" && (
            <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-2 text-base">
              MAIN
            </SidebarGroupLabel>
          )}
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={collapsed ? item.title : undefined}
                  className={cn(
                    "my-1.5 transition-all rounded-md",
                    location.pathname === item.path
                      ? "bg-purple-100 text-purple-600 font-medium"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-3 px-3 py-3">
                    <item.icon className="h-6 w-6 text-purple-500" />
                    {!collapsed && <span className="text-base">{item.title}</span>}
                    {item.badge && !collapsed && (
                      <span className="ml-auto bg-purple-100 text-purple-600 text-sm rounded-full h-6 min-w-6 px-2 flex items-center justify-center">
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
          <>
            <SidebarGroup className="mt-6">
              {!collapsed && (
                <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-2 text-base">
                  MANAGEMENT
                </SidebarGroupLabel>
              )}
              <SidebarMenu>
                {adminManagementItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={collapsed ? item.title : undefined}
                      className={cn(
                        "my-1.5 transition-all rounded-md",
                        location.pathname === item.path
                          ? "bg-purple-100 text-purple-600 font-medium"
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                      )}
                    >
                      <Link to={item.path} className="flex items-center gap-3 px-3 py-3">
                        <item.icon className="h-6 w-6 text-purple-500" />
                        {!collapsed && <span className="text-base">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              {!collapsed && (
                <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-2 text-base">
                  SUPPORT
                </SidebarGroupLabel>
              )}
              <SidebarMenu>
                {supportItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={collapsed ? item.title : undefined}
                      className={cn(
                        "my-1.5 transition-all rounded-md",
                        location.pathname === item.path
                          ? "bg-purple-100 text-purple-600 font-medium"
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                      )}
                    >
                      <Link to={item.path} className="flex items-center gap-3 px-3 py-3">
                        <item.icon className="h-6 w-6 text-purple-500" />
                        {!collapsed && <span className="text-base">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-gray-100 pt-3">
        <div className="px-4 py-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 bg-purple-100 text-purple-600">
              <AvatarFallback className="text-lg">{role === "admin" ? "U" : "S"}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-medium">{role === "admin" ? "User Admin" : "Staff User"}</span>
                <span className="text-sm text-gray-500">{role === "admin" ? "admin@example.com" : "staff@example.com"}</span>
              </div>
            )}
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip={collapsed ? "Logout" : undefined}
              className="hover:bg-purple-50 hover:text-purple-600 px-3 py-3 rounded-md mx-2"
            >
              <Link to="/logout" className="flex items-center gap-3 text-gray-600">
                <LogOut className="h-6 w-6 text-purple-500" />
                {!collapsed && <span className="text-base">Logout</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
