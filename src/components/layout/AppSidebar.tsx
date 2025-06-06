import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useBreakpoint } from "@/hooks/use-mobile";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarSection } from "./sidebar/SidebarSection";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { 
  staffItems, 
  adminItems, 
  adminManagementItems, 
  supportItems,
  categoryItems 
} from "./sidebar/sidebarItems";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  role: "staff" | "admin";
}

export const AppSidebar = ({ role }: AppSidebarProps) => {
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse on tablet size
      if (window.innerWidth < 1024 && window.innerWidth > 768 && !collapsed) {
        setCollapsed(true);
      } 
      // Auto-expand on desktop
      else if (window.innerWidth >= 1280 && collapsed) {
        setCollapsed(false);
      }
      // Keep collapsed on mobile
      else if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sidebar 
      className={cn(
        "border-r border-gray-100 bg-white print:hidden transition-all duration-300",
        collapsed && !isMobile ? "w-[70px]" : "w-[250px] md:w-[280px]"
      )}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
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
              title="QUẢN LÝ"
              items={adminManagementItems}
              collapsed={collapsed}
            />

            <SidebarSection
              title="DANH MỤC"
              items={categoryItems}
              collapsed={collapsed}
            />

            <SidebarSection
              title="HỖ TRỢ"
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
