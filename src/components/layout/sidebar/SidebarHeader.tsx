
import { cn } from "@/lib/utils";
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useBreakpoint } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarHeaderProps {
  role: "staff" | "admin";
  collapsed: boolean;
  toggleCollapse: () => void;
  className?: string;
}

export const SidebarHeader = ({ role, collapsed, toggleCollapse, className }: SidebarHeaderProps) => {
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");

  const showText = !collapsed || (collapsed && isMobile);
  
  return (
    <Header className={cn("p-2 md:p-3 flex items-center", className)}>
      <div className={cn(
        "flex items-center w-full",
        collapsed && !isMobile ? "justify-center" : "justify-between"
      )}>
        <Link to={role === "admin" ? "/admin" : "/staff"} className="flex items-center gap-2">
          {showText && (
            <div className="flex flex-col h-8 md:h-10 items-center justify-center">
              <img 
                src="/logo.gif" 
                alt="FashionHub" 
                className="h-20 md:h-32 w-auto max-w-[200px] md:max-w-[300px]" 
              />
            </div>
          )}
          {!showText && (
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-crocus-500 text-white font-bold text-sm">
              FH
            </div>
          )}
        </Link>
        
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className="text-gray-500 hover:text-crocus-600 hover:bg-crocus-50 h-7 w-7 md:h-8 md:w-8"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        )}
      </div>
    </Header>
  );
};
