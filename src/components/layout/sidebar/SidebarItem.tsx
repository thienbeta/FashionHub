
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

  // When collapsed, show tooltip on hover
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
      <Icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-5 w-5", "text-purple-500")} />
      {!collapsed && <span className="text-base truncate">{title}</span>}
      {badge && !collapsed && (
        <span className="ml-auto bg-purple-100 text-purple-600 text-xs rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
          {badge}
        </span>
      )}
      {badge && collapsed && (
        <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {badge}
        </span>
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
