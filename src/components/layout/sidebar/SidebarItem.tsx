
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  collapsed: boolean;
}

export const SidebarItem = ({ title, icon: Icon, path, badge, collapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

  const linkContent = (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 text-base rounded-md cursor-pointer transition-colors",
        isActive
          ? "bg-purple-100 text-purple-600 font-medium"
          : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
      )}
    >
      <div className={cn(
        "relative flex items-center justify-center",
        collapsed ? "w-full" : "w-auto"
      )}>
        <Icon className={cn("flex-shrink-0 h-5 w-5", isActive ? "text-purple-600" : "text-gray-500")} />
        
        {badge && collapsed && (
          <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      
      {!collapsed && (
        <>
          <span className="text-sm truncate">{title}</span>
          {badge && (
            <span className="ml-auto bg-purple-100 text-purple-600 text-xs rounded-full px-2 py-0.5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">{linkContent}</div>
        </TooltipTrigger>
        <TooltipContent side="right" className="z-50 bg-white border border-gray-100 shadow-md">
          {title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
};
