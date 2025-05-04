
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { SidebarItem } from "./SidebarItem";

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
    <SidebarGroup className="mt-4 md:mt-6">
      {!collapsed && title && (
        <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-2 text-xs md:text-sm">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              tooltip={collapsed ? item.title : undefined}
              className="my-1 transition-all rounded-md"
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
