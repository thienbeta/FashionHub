
import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarSeparator,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useBreakpoint } from "@/hooks/use-mobile";
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
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  const [collapsed, setCollapsed] = useState(false);
  
  // Auto-collapse sidebar on larger screens, but leave expanded on mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth > 768 && !collapsed) {
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
  
  // Determine adaptive width based on device and collapse state
  const sidebarWidth = () => {
    if (collapsed) {
      if (isMobile || isTablet) {
        return "w-[200px]"; // Wider on mobile/tablet when "collapsed" to show text
      }
      return "w-[70px] md:w-[80px]"; // Icon-only on desktop when collapsed
    }
    return "w-[250px] md:w-[280px]"; // Full width when expanded
  };

  return (
    <Sidebar className={cn(
      "border-r border-gray-100 bg-white print:hidden transition-all duration-300",
      sidebarWidth()
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
