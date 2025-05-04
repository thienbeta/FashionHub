
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter as Footer } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarFooterProps {
  role: "staff" | "admin";
  collapsed: boolean;
}

export const SidebarFooter = ({ role, collapsed }: SidebarFooterProps) => {
  const userInfo = (
    <div className="flex items-center gap-2 md:gap-3">
      <Avatar className="h-8 w-8 md:h-10 md:w-10 bg-purple-100 text-purple-600">
        <AvatarFallback className="text-sm md:text-base">{role === "admin" ? "U" : "S"}</AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm md:text-base font-medium truncate">{role === "admin" ? "User Admin" : "Staff User"}</span>
          <span className="text-xs md:text-sm text-gray-500 truncate">{role === "admin" ? "admin@example.com" : "staff@example.com"}</span>
        </div>
      )}
    </div>
  );
  
  const logoutButton = (
    <Link to="/logout" className="flex items-center gap-2 md:gap-3 text-gray-600 hover:text-purple-600">
      <LogOut className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
      {!collapsed && <span className="text-sm md:text-base">Logout</span>}
    </Link>
  );

  return (
    <Footer className="mt-auto border-t border-gray-100 pt-2 md:pt-3">
      <div className="px-3 md:px-4 py-2">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              {userInfo}
            </TooltipTrigger>
            <TooltipContent side="right">
              {role === "admin" ? "User Admin" : "Staff User"}
            </TooltipContent>
          </Tooltip>
        ) : (
          userInfo
        )}
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip={collapsed ? "Logout" : undefined}
            className="hover:bg-purple-50 hover:text-purple-600 px-2 md:px-3 py-2 md:py-3 rounded-md mx-1 md:mx-2"
          >
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  {logoutButton}
                </TooltipTrigger>
                <TooltipContent side="right">
                  Logout
                </TooltipContent>
              </Tooltip>
            ) : (
              logoutButton
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Footer>
  );
};
