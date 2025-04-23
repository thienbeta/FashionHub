
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

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStaff from "./pages/admin/AdminStaff";

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
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/products" element={<StaffProducts />} />
            <Route path="/admin/orders" element={<StaffOrders />} />
            <Route path="/admin/inventory" element={<StaffInventory />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
