
import { useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarSeparator 
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarSection } from "./sidebar/SidebarSection";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { 
  staffItems, 
  adminItems, 
  adminManagementItems, 
  supportItems 
} from "./sidebar/sidebarItems";

interface AppSidebarProps {
  role: "staff" | "admin";
}

export const AppSidebar = ({ role }: AppSidebarProps) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sidebar className="border-r border-gray-100 bg-white">
      <SidebarHeader 
        role={role} 
        collapsed={collapsed} 
        toggleCollapse={toggleCollapsed} 
      />

      <SidebarSeparator className="bg-gray-100" />

      <SidebarContent className="px-3">
        <SidebarSection 
          items={role === "staff" ? staffItems : adminItems}
          collapsed={collapsed}
        />

        {role === "admin" && (
          <>
            <SidebarSection
              title="MANAGEMENT"
              items={adminManagementItems}
              collapsed={collapsed}
            />

            <SidebarSection
              title="SUPPORT"
              items={supportItems}
              collapsed={collapsed}
            />
          </>
        )}
      </SidebarContent>

      <SidebarFooter role={role} collapsed={collapsed} />
    </Sidebar>
  );
};
