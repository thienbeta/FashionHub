import { Toaster } from "@/pages/ui/toaster";
import { Toaster as Sonner } from "@/pages/ui/sonner";
import { TooltipProvider } from "@/pages/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/pages/layout/AppShell";
import AdminLayout from "@/pages/layout/AdminLayout";
import UserLayout from "@/pages/layout/UserLayout"
import Index from "./pages/user/Index";
import NotFound from "./pages/sections/NotFound";
import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetail";
import About from "./pages/sections/About";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Profile } from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDanhMuc from "./pages/admin/AdminDanhMuc";
import AdminSanPham from "./pages/admin/AdminSanPham";
import AdminNguoiDung from "./pages/admin/AdminNguoiDung";
import Favourites from "./pages/products/Favourites";
import Security from "./pages/sections/Security";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="about" element={<About />} />
              <Route path="auth/login" element={<Login />} />
              <Route path="auth/register" element={<Register />} />
              <Route path="auth/forgot-password" element={<ForgotPassword />} />
              <Route path="profile" element={<Profile />} />
              <Route path="security" element={<Security />} />
              <Route path="favourites" element={<Favourites />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin" element={<AdminLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="danhmuc" element={<AdminDanhMuc />} />
              <Route path="sanpham" element={<AdminSanPham />} />
              <Route path="nguoidung" element={<AdminNguoiDung />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </AppShell>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;