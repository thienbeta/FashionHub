
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useBreakpoint } from "@/hooks/use-mobile";

interface SidebarHeaderProps {
  role: "staff" | "admin";
  collapsed: boolean;
  toggleCollapse: () => void;
}

export const SidebarHeader = ({ role, collapsed, toggleCollapse }: SidebarHeaderProps) => {
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  
  // Always show text on mobile/tablet when collapsed
  const showText = !collapsed || (collapsed && (isMobile || isTablet));
  
  return (
    <Header className="p-3 flex items-center justify-between">
      <div className={cn(
        "flex items-center gap-3",
        collapsed && !showText ? "justify-center w-full" : ""
      )}>
        <Link to={role === "admin" ? "/admin" : "/staff"} className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-purple-400 flex items-center justify-center text-white text-lg font-semibold">
            {role === "staff" ? "S" : "A"}
          </div>
          {showText && (
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-800">
                Fashion Hub
              </span>
              <span className="text-xs text-gray-500">
                {role === "staff" ? "Staff Portal" : "Admin Portal"}
              </span>
            </div>
          )}
        </Link>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-gray-500 hover:bg-gray-100 transition-all",
          collapsed ? "absolute right-2" : ""
        )}
        onClick={toggleCollapse}
      >
        <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
      </Button>
    </Header>
  );
};
