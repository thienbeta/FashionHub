
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  BarChart, FileText, Archive, Settings, 
  HelpCircle, CreditCard, Megaphone, MessageSquare, 
  Calendar, Globe, Shield, Heart, ClipboardList, 
  TruckIcon, TagIcon 
} from "lucide-react";

// Main menu items
export const staffItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/staff" },
  { title: "Products", icon: Package, path: "/staff/products" },
  { title: "Orders", icon: ShoppingCart, path: "/staff/orders", badge: "3" },
  { title: "Inventory", icon: Archive, path: "/staff/inventory" },
  { title: "Purchase Orders", icon: ClipboardList, path: "/staff/purchase-orders" },
  { title: "Shipping", icon: TruckIcon, path: "/staff/shipping" },
  { title: "Categories", icon: TagIcon, path: "/staff/categories" },
];

export const adminItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Orders", icon: ShoppingCart, path: "/admin/orders", badge: "5" },
  { title: "Products", icon: Package, path: "/admin/products" },
  { title: "Customers", icon: Users, path: "/admin/users" },
  { title: "Analytics", icon: BarChart, path: "/admin/analytics" },
  { title: "Invoices", icon: FileText, path: "/admin/invoices" },
];

// Marketing and communications items
export const adminManagementItems = [
  { title: "Payments", icon: CreditCard, path: "/admin/payments" },
  { title: "Marketing", icon: Megaphone, path: "/admin/marketing" },
  { title: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { title: "Chat", icon: MessageSquare, path: "/admin/chat" },
  { title: "Calendar", icon: Calendar, path: "/admin/calendar" },
  { title: "Reports", icon: BarChart, path: "/admin/reports" },
];

// Support items
export const supportItems = [
  { title: "Settings", icon: Settings, path: "/admin/settings" },
  { title: "Help Center", icon: HelpCircle, path: "/admin/help" },
  { title: "Favorites", icon: Heart, path: "/admin/favorites" },
  { title: "Website", icon: Globe, path: "/admin/website" },
  { title: "Security", icon: Shield, path: "/admin/security" },
];
