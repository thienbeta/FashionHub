
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
    <Sidebar>
      <SidebarHeader className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-crocus-500 to-crocus-700 flex items-center justify-center text-white font-semibold">
            {role === "staff" ? "S" : "A"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{role === "staff" ? "Staff Panel" : "Admin Panel"}</span>
            <span className="text-xs text-slate-500">Fashion Hub</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "staff" ? "Staff Menu" : "Admin Menu"}</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={isMobile ? undefined : item.title}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto bg-crocus-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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

      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/help" className="flex items-center gap-2 text-slate-600">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/logout" className="flex items-center gap-2 text-slate-600">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
