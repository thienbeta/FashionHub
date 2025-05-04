
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SidebarHeader as Header } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  role: "staff" | "admin";
  collapsed: boolean;
  toggleCollapse: () => void;
}

export const SidebarHeader = ({ role, collapsed, toggleCollapse }: SidebarHeaderProps) => {
  return (
    <Header className="p-2 md:p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-md bg-purple-400 flex items-center justify-center text-white text-base md:text-lg font-semibold">
          {role === "staff" ? "S" : "A"}
        </div>
        {!collapsed && (
          <span className="text-base md:text-lg font-semibold text-gray-700 truncate">
            {role === "staff" ? "StaffPro" : "AdminPro"}
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:bg-gray-100"
        onClick={toggleCollapse}
      >
        <ChevronLeft className={cn("h-4 w-4 md:h-5 md:w-5 transition-transform", collapsed && "rotate-180")} />
      </Button>
    </Header>
  );
};
