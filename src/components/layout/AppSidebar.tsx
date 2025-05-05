
import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarSeparator,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarSection } from "./sidebar/SidebarSection";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { 
  staffItems, 
  adminItems, 
  adminManagementItems, 
  supportItems 
} from "./sidebar/sidebarItems";
import { cn } from "@/lib/utils";
import { successToast } from "@/utils/notifications";

interface AppSidebarProps {
  role: "staff" | "admin";
}

export const AppSidebar = ({ role }: AppSidebarProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [collapsed, setCollapsed] = useState(false);
  
  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && !collapsed) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1280 && collapsed) {
        setCollapsed(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    successToast(collapsed ? "Sidebar expanded" : "Sidebar collapsed");
  };

  return (
    <Sidebar className={cn(
      "border-r border-gray-100 bg-white print:hidden transition-all duration-300",
      collapsed ? "w-[70px] md:w-[80px]" : "w-[250px] md:w-[280px]"
    )}>
      <SidebarHeader 
        role={role} 
        collapsed={collapsed} 
        toggleCollapse={toggleCollapsed} 
      />

      <SidebarSeparator className="bg-gray-100" />

      <SidebarContent className="px-2 md:px-3">
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
