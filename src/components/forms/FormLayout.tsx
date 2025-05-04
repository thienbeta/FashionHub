
import React, { useState, useEffect } from "react";
import { FormSidebar } from "./FormSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface FormLayoutProps {
  children: React.ReactNode;
  activeFormId?: string;
}

export const FormLayout = ({ children, activeFormId }: FormLayoutProps) => {
  const [selectedFormId, setSelectedFormId] = useState<string>(activeFormId || "");
  const [isMobile, setIsMobile] = useState(false);
  
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

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <FormSidebar activeFormId={selectedFormId} onFormSelect={setSelectedFormId} />
      </div>
      
      {/* Mobile sidebar drawer */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="fixed bottom-6 left-6 z-10 h-12 w-12 rounded-full shadow-lg bg-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-full max-w-xs">
            <FormSidebar activeFormId={selectedFormId} onFormSelect={setSelectedFormId} />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
};
