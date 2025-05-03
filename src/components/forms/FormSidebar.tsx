
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { FileText, ClipboardList, Package, TruckIcon, TagIcon, ShoppingCart } from "lucide-react";

interface FormOption {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
}

const formOptions: FormOption[] = [
  { id: "inventory", name: "Inventory Form", path: "/staff/inventory/form", icon: Package },
  { id: "purchase-orders", name: "Purchase Orders Form", path: "/staff/purchase-orders/form", icon: ClipboardList },
  { id: "products", name: "Products Form", path: "/staff/products/form", icon: TagIcon },
  { id: "shipping", name: "Shipping Form", path: "/staff/shipping/form", icon: TruckIcon },
  { id: "orders", name: "Orders Form", path: "/staff/orders/form", icon: ShoppingCart },
  { id: "invoice", name: "Invoice Form", path: "/staff/invoice/form", icon: FileText },
];

interface FormSidebarProps {
  activeFormId?: string;
  onFormSelect?: (formId: string) => void;
}

export const FormSidebar = ({ activeFormId, onFormSelect }: FormSidebarProps) => {
  const [selectedFormId, setSelectedFormId] = useState<string>(activeFormId || "");

  const handleFormSelect = (formId: string) => {
    setSelectedFormId(formId);
    if (onFormSelect) {
      onFormSelect(formId);
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white w-64 min-w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-4 text-lg">
            Forms
          </SidebarGroupLabel>
          <div className="flex flex-col space-y-1 px-2">
            {formOptions.map((form) => (
              <Link
                key={form.id}
                to={form.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 text-base rounded-md cursor-pointer transition-colors",
                  selectedFormId === form.id
                    ? "bg-purple-500 text-white font-medium"
                    : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                )}
                onClick={() => handleFormSelect(form.id)}
              >
                <form.icon className={cn(
                  "h-6 w-6",
                  selectedFormId === form.id ? "text-white" : "text-purple-500"
                )} />
                <span className="text-lg">{form.name}</span>
              </Link>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
