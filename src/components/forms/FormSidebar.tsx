
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

  const showText = !collapsed || isMobile || isTablet;
  
  const adjustedFormOptions = formOptions.map(form => ({
    ...form,
    path: isAdmin ? form.path.replace('/staff/', '/admin/') : form.path
  }));

  return (
    <div className={cn("p-2", collapsed && !isMobile ? "px-1" : "")}>
      <div className="space-y-1">
        {adjustedFormOptions.map((form) => {
          const Icon = form.icon;
          const isActive = selectedFormId === form.id;
          
          if (collapsed && !showText) {
            return (
              <Tooltip key={form.id}>
                <TooltipTrigger asChild>
                  <Link
                    to={form.path}
                    onClick={() => handleFormSelect(form.id)}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md transition-colors",
                      isActive 
                        ? "bg-crocus-100 text-crocus-600" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{form.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={form.id}
              to={form.path}
              onClick={() => handleFormSelect(form.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md transition-colors",
                isActive 
                  ? "bg-crocus-100 text-crocus-600" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {showText && (
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{form.name}</p>
                  {form.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
