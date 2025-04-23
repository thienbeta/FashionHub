
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Archive,
  Settings,
} from "lucide-react";

interface SidebarItemType {
  title: string;
  icon: any;
  path: string;
}

const staffItems: SidebarItemType[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/staff" },
  { title: "Products", icon: Package, path: "/staff/products" },
  { title: "Orders", icon: ShoppingCart, path: "/staff/orders" },
  { title: "Inventory", icon: Archive, path: "/staff/inventory" },
];

const adminItems: SidebarItemType[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Users", icon: Users, path: "/admin/users" },
  { title: "Staff", icon: Users, path: "/admin/staff" },
  { title: "Products", icon: Package, path: "/admin/products" },
  { title: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { title: "Inventory", icon: Archive, path: "/admin/inventory" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

interface AppSidebarProps {
  role: "staff" | "admin";
}

export const AppSidebar = ({ role }: AppSidebarProps) => {
  const location = useLocation();
  const items = role === "staff" ? staffItems : adminItems;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "staff" ? "Staff Panel" : "Admin Panel"}</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={item.title}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
