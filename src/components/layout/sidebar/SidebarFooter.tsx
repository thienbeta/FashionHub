
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter as Footer } from "@/components/ui/sidebar";

interface SidebarFooterProps {
  role: "staff" | "admin";
  collapsed: boolean;
}

export const SidebarFooter = ({ role, collapsed }: SidebarFooterProps) => {
  return (
    <Footer className="mt-auto border-t border-gray-100 pt-3">
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
    </Footer>
  );
};
