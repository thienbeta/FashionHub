
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
  Archive,
  Settings,
  ShieldCheck,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  { title: "Users", icon: Users, path: "/admin/users" },
  { title: "Staff", icon: ShieldCheck, path: "/admin/staff" },
  { title: "Products", icon: Package, path: "/admin/products" },
  { title: "Orders", icon: ShoppingCart, path: "/admin/orders", badge: "5" },
  { title: "Inventory", icon: Archive, path: "/admin/inventory" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

interface AppSidebarProps {
  role: "staff" | "admin";
}

export const AppSidebar = ({ role }: AppSidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const items = role === "staff" ? staffItems : adminItems;

  return (
    <Sidebar className="border-r border-crocus-100 bg-gradient-to-b from-white to-crocus-50">
      <SidebarHeader className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-crocus-400 to-crocus-600 flex items-center justify-center text-white font-semibold shadow-md shadow-crocus-300/20">
            {role === "staff" ? "S" : "A"}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium text-crocus-800">{role === "staff" ? "Staff Panel" : "Admin Panel"}</span>
            <span className="text-xs text-crocus-500 font-medium">Fashion Hub</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-crocus-100" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-crocus-600 font-medium px-5">
            {role === "staff" ? "Staff Menu" : "Admin Menu"}
          </SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={isMobile ? undefined : item.title}
                  className={`mx-3 transition-all px-4 ${
                    location.pathname === item.path
                      ? "bg-crocus-100 text-crocus-700 font-medium"
                      : "text-slate-600 hover:bg-crocus-50"
                  }`}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto bg-gradient-to-br from-crocus-500 to-crocus-600 text-white text-xs rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-crocus-100 bg-crocus-50/50 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="mx-3 hover:bg-crocus-50 px-4">
              <Link to="/help" className="flex items-center gap-3 text-slate-600">
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="mx-3 hover:bg-crocus-50 px-4">
              <Link to="/logout" className="flex items-center gap-3 text-slate-600">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-4 text-xs text-center text-crocus-400">
          Fashion Hub © 2025
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
