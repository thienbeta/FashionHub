import { Toaster } from "@/pages/ui/toaster";
import { Toaster as Sonner } from "@/pages/ui/sonner";
import { TooltipProvider } from "@/pages/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/pages/layout/AppShell";
import AdminLayout from "@/pages/layout/AdminLayout";
import UserLayout from "@/pages/layout/UserLayout";

import Index from "./pages/user/Index";
import NotFound from "./pages/products/NotFound";
import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetail";
import BlogList from "./pages/blogs/BlogList";
import BlogDetail from "./pages/blogs/BlogDetail";
import FavoritesList from "./pages/products/FavoritesList";
import Contact from "./pages/sections/Contact";
import About from "./pages/sections/About";
import { Login } from "./pages/auth/Login";
import { Register }from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Profile } from "./pages/user/Profile";
import { Cart } from "./pages/user/Cart";
import { Checkout } from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import ViewProfile from "./pages/user/ViewProfile";
import { Messages } from "./pages/user/Messages";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminContact from "./pages/admin/AdminContact";
import AdminType from "./pages/admin/AdminType";
import AdminSubcategories from "./pages/admin/AdminSubcategories";
import AdminTrademark from "./pages/admin/AdminTrademark";
import AdminBlogs from "./pages/admin/AdminBlogs";

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
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/:id" element={<BlogDetail />} />
              <Route path="favorites" element={<FavoritesList />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              <Route path="auth/login" element={<Login />} />
              <Route path="auth/register" element={<Register />} />
              <Route path="auth/forgot-password" element={<ForgotPassword />} />
              <Route path="profile" element={<Profile />} />
              <Route path="user/cart" element={<Cart />} />
              <Route path="user/checkout" element={<Checkout />} />
              <Route path="user/orders" element={<Orders />} />
              <Route path="messages" element={<Messages />} />

              <Route path="profile/:userId" element={<ViewProfile />} />
            </Route>

            <Route path="/admin" element={<AdminLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="contact" element={<AdminContact />} />
              <Route path="type" element={<AdminType />} />
              <Route path="subcategories" element={<AdminSubcategories />} />
              <Route path="trademark" element={<AdminTrademark />} />
              <Route path="blogs" element={<AdminBlogs />} />
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