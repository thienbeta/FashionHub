
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { FileText, ClipboardList, Package, TruckIcon, TagIcon, ShoppingCart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
}

export const FormSidebar = ({ activeFormId, onFormSelect }: FormSidebarProps) => {
  const [selectedFormId, setSelectedFormId] = useState<string>(activeFormId || "");
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  
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
  
  // Adjust paths based on whether we're in admin or staff section
  const adjustedFormOptions = formOptions.map(form => ({
    ...form,
    path: isAdmin ? form.path.replace('/staff/', '/admin/') : form.path
  }));

  return (
    <Sidebar className="border-r border-gray-200 bg-white w-64 min-w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-4 text-base sm:text-lg">
            Forms
          </SidebarGroupLabel>
          <div className="flex flex-col space-y-1 px-2">
            {adjustedFormOptions.map((form) => (
              <Tooltip key={form.id}>
                <TooltipTrigger asChild>
                  <Link
                    to={form.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base rounded-md cursor-pointer transition-colors",
                      selectedFormId === form.id
                        ? "bg-purple-500 text-white font-medium"
                        : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    )}
                    onClick={() => handleFormSelect(form.id)}
                  >
                    <form.icon className={cn(
                      "h-4 w-4 sm:h-5 sm:w-5",
                      selectedFormId === form.id ? "text-white" : "text-purple-500"
                    )} />
                    <span className="text-sm sm:text-base truncate">{form.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {form.description}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
