
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Product Pages
import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetail";

// Combo Pages
import CombosList from "./pages/combos/CombosList";
import ComboDetail from "./pages/combos/ComboDetail";

// Blog Pages
import BlogsList from "./pages/blogs/BlogsList";
import BlogDetail from "./pages/blogs/BlogDetail";

// Favorites Page
import FavoritesList from "./pages/favorites/FavoritesList";

// Contact Page
import Contact from "./pages/contact/Contact";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User Pages
import Profile from "./pages/user/Profile";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";

// Staff Pages
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffProducts from "./pages/staff/StaffProducts";
import StaffOrders from "./pages/staff/StaffOrders";
import StaffInventory from "./pages/staff/StaffInventory";
import InventoryForm from "./pages/staff/InventoryForm";
import PurchaseOrdersForm from "./pages/staff/PurchaseOrdersForm";
import ProductsForm from "./pages/staff/ProductsForm";
import ShippingForm from "./pages/staff/ShippingForm";
import OrdersForm from "./pages/staff/OrdersForm";
import InvoiceForm from "./pages/staff/InvoiceForm";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppShell>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Product Routes */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* Combo Routes */}
            <Route path="/combos" element={<CombosList />} />
            <Route path="/combos/:id" element={<ComboDetail />} />
            
            {/* Blog Routes */}
            <Route path="/blogs" element={<BlogsList />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            
            {/* Favorites */}
            <Route path="/favorites" element={<FavoritesList />} />
            
            {/* Contact */}
            <Route path="/contact" element={<Contact />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            
            {/* User Routes */}
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/cart" element={<Cart />} />
            <Route path="/user/checkout" element={<Checkout />} />
            <Route path="/user/orders" element={<Orders />} />
            
            {/* Staff Routes */}
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/products" element={<StaffProducts />} />
            <Route path="/staff/orders" element={<StaffOrders />} />
            <Route path="/staff/inventory" element={<StaffInventory />} />
            
            {/* Staff Form Routes */}
            <Route path="/staff/inventory/form" element={<InventoryForm />} />
            <Route path="/staff/purchase-orders/form" element={<PurchaseOrdersForm />} />
            <Route path="/staff/products/form" element={<ProductsForm />} />
            <Route path="/staff/shipping/form" element={<ShippingForm />} />
            <Route path="/staff/orders/form" element={<OrdersForm />} />
            <Route path="/staff/invoice/form" element={<InvoiceForm />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/products" element={<StaffProducts />} />
            <Route path="/admin/orders" element={<StaffOrders />} />
            <Route path="/admin/inventory" element={<StaffInventory />} />
            <Route path="/admin/analytics" element={<NotFound />} />
            
            {/* Admin Form Routes */}
            <Route path="/admin/inventory/form" element={<InventoryForm />} />
            <Route path="/admin/purchase-orders/form" element={<PurchaseOrdersForm />} />
            <Route path="/admin/products/form" element={<ProductsForm />} />
            <Route path="/admin/shipping/form" element={<ShippingForm />} />
            <Route path="/admin/orders/form" element={<OrdersForm />} />
            <Route path="/admin/invoice/form" element={<InvoiceForm />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
