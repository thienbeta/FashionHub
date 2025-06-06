
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

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">Forms</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <FormSidebar activeFormId={selectedFormId} onFormSelect={setSelectedFormId} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className={cn(
        "border-r transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-80"
      )}>
        <div className="p-2 border-b flex items-center justify-between">
          {!sidebarCollapsed && <h2 className="font-semibold">Forms</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? (
              <ArrowRightCircle className="h-4 w-4" />
            ) : (
              <ArrowLeftCircle className="h-4 w-4" />
            )}
          </Button>
        </div>
        <FormSidebar 
          activeFormId={selectedFormId} 
          onFormSelect={setSelectedFormId}
          collapsed={sidebarCollapsed}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
