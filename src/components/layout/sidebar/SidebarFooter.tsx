
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter as Footer } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-mobile";

interface SidebarFooterProps {
  role: "staff" | "admin";
  collapsed: boolean;
}

export const SidebarFooter = ({ role, collapsed }: SidebarFooterProps) => {
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  
  // Always show text on mobile/tablet when collapsed
  const showText = !collapsed || (collapsed && (isMobile || isTablet));
  
  const userInfo = (
    <div className={cn(
      "flex items-center gap-3",
      collapsed && !showText ? "justify-center" : ""
    )}>
      <Avatar className="h-8 w-8 bg-purple-100 border border-purple-200">
        <AvatarFallback className="text-sm text-purple-600">{role === "admin" ? "A" : "S"}</AvatarFallback>
      </Avatar>
      {showText && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">{role === "admin" ? "Admin User" : "Staff User"}</span>
          <span className="text-xs text-gray-500 truncate">{role === "admin" ? "admin@example.com" : "staff@example.com"}</span>
        </div>
      )}
    </div>
  );
  
  return (
    <Footer className="mt-auto border-t border-gray-100 pt-2">
      <div className={cn(
        "px-3 py-2",
        collapsed && !showText ? "flex justify-center" : ""
      )}>
        {collapsed && !showText ? (
          <Tooltip>
            <TooltipTrigger asChild>
              {userInfo}
            </TooltipTrigger>
            <TooltipContent side="right">
              {role === "admin" ? "Admin User" : "Staff User"}
            </TooltipContent>
          </Tooltip>
        ) : (
          userInfo
        )}
      </div>
      <SidebarMenu>
        <div className={cn(
          "flex",
          collapsed && !showText ? "flex-col items-center gap-2" : "items-center justify-between px-3 py-2"
        )}>
          {collapsed && !showText ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={`/${role}/settings`} className="p-2 rounded-md hover:bg-purple-50 text-gray-500 hover:text-purple-600">
                    <Settings size={18} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/auth/login" className="p-2 rounded-md hover:bg-purple-50 text-gray-500 hover:text-purple-600">
                    <LogOut size={18} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Link to={`/${role}/settings`} className="flex items-center gap-2 text-gray-500 hover:text-purple-600">
                <Settings size={18} />
                <span className="text-sm">Settings</span>
              </Link>
              
              <Link to="/auth/login" className="flex items-center gap-2 text-gray-500 hover:text-purple-600">
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </Link>
            </>
          )}
        </div>
      </SidebarMenu>
    </Footer>
  );
};
