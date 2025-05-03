
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
    <Header className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-md bg-purple-400 flex items-center justify-center text-white text-lg font-semibold">
          {role === "staff" ? "S" : "A"}
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-gray-700">
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
        <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
      </Button>
    </Header>
  );
};
