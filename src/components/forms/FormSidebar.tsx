
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  ClipboardList, 
  Package, 
  TruckIcon, 
  TagIcon, 
  ShoppingCart, 
  ChevronLeft 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { successToast } from "@/utils/notifications";
import { useBreakpoint } from "@/hooks/use-mobile";

interface FormOption {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
  description?: string;
}

const formOptions: FormOption[] = [
  { 
    id: "inventory", 
    name: "Inventory Form", 
    path: "/staff/inventory/form", 
    icon: Package,
    description: "Manage your stock and inventory items"
  },
  { 
    id: "purchase-orders", 
    name: "Purchase Orders", 
    path: "/staff/purchase-orders/form", 
    icon: ClipboardList,
    description: "Create and manage purchase orders"
  },
  { 
    id: "products", 
    name: "Products Form", 
    path: "/staff/products/form", 
    icon: TagIcon,
    description: "Add or update product information"
  },
  { 
    id: "shipping", 
    name: "Shipping Form", 
    path: "/staff/shipping/form", 
    icon: TruckIcon,
    description: "Create shipping labels and manage deliveries"
  },
  { 
    id: "orders", 
    name: "Orders Form", 
    path: "/staff/orders/form", 
    icon: ShoppingCart,
    description: "Process and manage customer orders"
  },
  { 
    id: "invoice", 
    name: "Invoice Form", 
    path: "/staff/invoice/form", 
    icon: FileText,
    description: "Generate customer invoices and receipts"
  },
];

interface FormSidebarProps {
  activeFormId?: string;
  onFormSelect?: (formId: string) => void;
  collapsed?: boolean;
}

export const FormSidebar = ({ activeFormId, onFormSelect, collapsed = false }: FormSidebarProps) => {
  const [selectedFormId, setSelectedFormId] = useState<string>(activeFormId || "");
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  
  useEffect(() => {
    if (activeFormId) {
      setSelectedFormId(activeFormId);
    }
  }, [activeFormId]);

  const handleFormSelect = (formId: string) => {
    setSelectedFormId(formId);
    if (onFormSelect) {
      onFormSelect(formId);
    }
  };

  // Determine if we should show text in collapsed state (always true on mobile/tablet)
  const showText = !collapsed || isMobile || isTablet;
  
  // Adjust paths based on whether we're in admin or staff section
  const adjustedFormOptions = formOptions.map(form => ({
    ...form,
    path: isAdmin ? form.path.replace('/staff/', '/admin/') : form.path
  }));

  return (
    <Sidebar className={cn(
      "border-r border-purple-100 bg-white h-full transition-all duration-300 ease-in-out shadow-sm",
      collapsed && !(isMobile || isTablet) ? "w-[60px]" : "w-64"
    )}>
      <div className="flex items-center justify-between p-3 border-b border-purple-100">
        <h2 className={cn(
          "font-medium text-gray-800 transition-opacity duration-300",
          collapsed && !showText ? "opacity-0 w-0" : "opacity-100"
        )}>
          Forms
        </h2>
      </div>
      <SidebarContent>
        <SidebarGroup>
          {!showText && (
            <SidebarGroupLabel className="sr-only">
              Forms
            </SidebarGroupLabel>
          )}
          {showText && (
            <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-4 text-sm">
              FORM NAVIGATION
            </SidebarGroupLabel>
          )}
          <div className="flex flex-col space-y-1 px-2">
            {adjustedFormOptions.map((form) => (
              <Tooltip key={form.id}>
                <TooltipTrigger asChild>
                  <Link
                    to={form.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm rounded-md cursor-pointer transition-all",
                      selectedFormId === form.id
                        ? "bg-purple-500 text-white font-medium"
                        : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600",
                      collapsed && !showText ? "justify-center" : ""
                    )}
                    onClick={() => handleFormSelect(form.id)}
                  >
                    <form.icon className={cn(
                      "h-5 w-5",
                      selectedFormId === form.id ? "text-white" : "text-purple-500"
                    )} />
                    {showText && (
                      <span className="text-sm truncate">{form.name}</span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className={cn(
                  "z-50 bg-white border border-gray-100 shadow-md",
                  collapsed && !isMobile && !isTablet ? "block" : "hidden"
                )}>
                  {form.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
