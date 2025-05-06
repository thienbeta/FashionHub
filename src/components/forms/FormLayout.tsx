
import React, { useState, useEffect } from "react";
import { FormSidebar } from "./FormSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormLayoutProps {
  children: React.ReactNode;
  activeFormId?: string;
}

export const FormLayout = ({ children, activeFormId }: FormLayoutProps) => {
  const [selectedFormId, setSelectedFormId] = useState<string>(activeFormId || "");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount and when window resizes
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-full bg-gray-50/50">
      {/* Desktop sidebar */}
      <div className={cn(
        "hidden md:block transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-[60px]" : "w-64"
      )}>
        <FormSidebar 
          activeFormId={selectedFormId} 
          onFormSelect={setSelectedFormId} 
          collapsed={sidebarCollapsed}
        />
      </div>
      
      {/* Mobile sidebar drawer */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="fixed bottom-6 left-6 z-10 h-12 w-12 rounded-full shadow-lg bg-white border-purple-200"
            >
              <Menu className="h-5 w-5 text-purple-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-full max-w-xs">
            <FormSidebar activeFormId={selectedFormId} onFormSelect={setSelectedFormId} />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Sidebar collapse toggle button (desktop only) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="hidden md:flex fixed left-[270px] top-4 z-30 h-8 w-8 rounded-full transition-all duration-300 ease-in-out"
        style={{ left: sidebarCollapsed ? '70px' : '270px' }}
      >
        {sidebarCollapsed ? (
          <ArrowRightCircle className="h-5 w-5 text-purple-600" />
        ) : (
          <ArrowLeftCircle className="h-5 w-5 text-purple-600" />
        )}
      </Button>
      
      <div className={cn(
        "flex-1 p-2 sm:p-4 md:p-6 overflow-auto transition-all duration-300",
        sidebarCollapsed ? "md:ml-[60px]" : ""
      )}>
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
