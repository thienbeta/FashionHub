
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  collapsed: boolean;
}

export const SidebarItem = ({ title, icon: Icon, path, badge, collapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-3 text-base rounded-md cursor-pointer transition-colors",
        isActive
          ? "bg-purple-100 text-purple-600 font-medium"
          : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
      )}
    >
      <Icon className="h-6 w-6 text-purple-500" />
      {!collapsed && <span className="text-base">{title}</span>}
      {badge && !collapsed && (
        <span className="ml-auto bg-purple-100 text-purple-600 text-sm rounded-full h-6 min-w-6 px-2 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
};
