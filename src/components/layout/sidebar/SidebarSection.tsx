
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";

interface SidebarItemType {
  title: string;
  icon: any;
  path: string;
  badge?: string;
}

interface SidebarSectionProps {
  title?: string;
  items: SidebarItemType[];
  collapsed: boolean;
}

export const SidebarSection = ({ title, items, collapsed }: SidebarSectionProps) => {
  return (
    <SidebarGroup className={cn("mt-4", collapsed ? "px-1" : "px-2")}>
      {!collapsed && title && (
        <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-2 text-xs">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.path} className={cn(
            collapsed ? "px-0 w-full flex justify-center" : ""
          )}>
            <SidebarMenuButton
              asChild
              tooltip={collapsed ? item.title : undefined}
              className={cn(
                "my-1 transition-all rounded-md",
                collapsed ? "w-full" : ""
              )}
            >
              <SidebarItem
                title={item.title}
                icon={item.icon}
                path={item.path}
                badge={item.badge}
                collapsed={collapsed}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
