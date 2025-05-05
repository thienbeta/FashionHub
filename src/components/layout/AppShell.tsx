import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AdminFooter } from "./AdminFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  ShoppingCart, 
  User,
  LogIn,
  LogOut,
  Heart,
  MessageCircle,
  Package,
  LayoutGrid
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  Drawer,
  DrawerClose, 
  DrawerContent, 
  DrawerTrigger 
} from "@/components/ui/drawer";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [userRole, setUserRole] = useState<"guest" | "user" | "staff" | "admin">("guest");
  const location = useLocation();
  const isMobile = useIsMobile();

  // Demo function to toggle between user roles
  const cycleUserRole = () => {
    if (userRole === "guest") setUserRole("user");
    else if (userRole === "user") setUserRole("staff");
    else if (userRole === "staff") setUserRole("admin");
    else setUserRole("guest");
  };

  // Links for navigation
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Products", path: "/products" },
    { title: "Combos", path: "/combos" },
    { title: "Blog", path: "/blogs" },
    { title: "Contact", path: "/contact" },
  ];
  
  // Check if we're in admin or staff section
  const isAdminOrStaff = userRole === "staff" || userRole === "admin";
  const currentPath = location.pathname;
  const isAdminOrStaffSection = currentPath.startsWith('/admin') || currentPath.startsWith('/staff');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isAdminOrStaff && (
          <AppSidebar role={userRole as "staff" | "admin"} />
        )}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                {(userRole === "staff" || userRole === "admin") && (
                  <SidebarTrigger />
                )}
                <Link to="/" className="flex items-center gap-2">
                  <span className="font-bold text-xl bg-gradient-to-r from-crocus-500 to-crocus-700 bg-clip-text text-transparent">Fashion Hub</span>
                  <span className="hidden sm:inline-block font-light">Style & Elegance</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:block">
                <NavigationMenu>
                  <NavigationMenuList>
                    {navLinks.map(link => (
                      <NavigationMenuItem key={link.path}>
                        <Link to={link.path}>
                          <NavigationMenuLink className={cn(
                            navigationMenuTriggerStyle(),
                            location.pathname === link.path && "bg-accent text-accent-foreground",
                            "px-4 py-2"
                          )}>
                            {link.title}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </nav>

              <div className="flex items-center gap-4">
                {/* Mobile Navigation Drawer */}
                <Drawer>
                  <DrawerTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="p-4 pt-0">
                      <div className="flex flex-col gap-2 py-4">
                        {navLinks.map(link => (
                          <DrawerClose key={link.path} asChild>
                            <Link 
                              to={link.path} 
                              className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-md",
                                location.pathname === link.path 
                                  ? "bg-crocus-100 text-crocus-700 font-medium" 
                                  : "text-gray-600"
                              )}
                            >
                              {link.title}
                            </Link>
                          </DrawerClose>
                        ))}
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
                
                {/* User Icons */}
                {(userRole === "user") && (
                  <>
                    <Link to="/favorites" className={cn(
                      "relative hover:text-crocus-600 transition-colors",
                      location.pathname === "/favorites" ? "text-crocus-600" : "text-gray-600"
                    )}>
                      <Heart className="h-5 w-5" />
                    </Link>
                    <Link to="/user/cart" className={cn(
                      "relative hover:text-crocus-600 transition-colors",
                      location.pathname === "/user/cart" ? "text-crocus-600" : "text-gray-600"
                    )}>
                      <ShoppingCart className="h-5 w-5" />
                      <span className="absolute -top-2 -right-2 bg-crocus-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                      </span>
                    </Link>
                  </>
                )}
                
                <Button variant="ghost" size="sm" onClick={cycleUserRole} className="hidden sm:flex">
                  {userRole === "guest" ? "Guest" : userRole === "user" ? "User" : userRole === "staff" ? "Staff" : "Admin"}
                </Button>
                
                {userRole === "guest" ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/auth/login">
                      <LogIn className="h-4 w-4 mr-2" /> Login
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="container mx-auto py-6 px-4">
              {children}
            </div>
          </main>

          {/* Footer - Show AdminFooter for staff/admin users in admin/staff sections */}
          {isAdminOrStaff && isAdminOrStaffSection ? (
            <AdminFooter role={userRole as "staff" | "admin"} />
          ) : (
            <footer className="bg-gray-50 border-t border-gray-200 py-8">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-crocus-700">CROCUS Fashion</h3>
                    <p className="text-gray-600">
                      Bringing you the hottest trends in fashion with the 2025 Pantone color.
                    </p>
                  </div>
                  
                  {/* Rest of the footer content */}
                  <div className="hidden md:block">
                    <h3 className="font-bold text-lg mb-4 text-crocus-700">Shop</h3>
                    <ul className="space-y-2">
                      <li><Link to="/products" className="text-gray-600 hover:text-crocus-500">Products</Link></li>
                      <li><Link to="/combos" className="text-gray-600 hover:text-crocus-500">Combos</Link></li>
                      <li><Link to="/products/new" className="text-gray-600 hover:text-crocus-500">New Arrivals</Link></li>
                      <li><Link to="/favorites" className="text-gray-600 hover:text-crocus-500">Favorites</Link></li>
                    </ul>
                  </div>
                  <div className="hidden md:block">
                    <h3 className="font-bold text-lg mb-4 text-crocus-700">Account</h3>
                    <ul className="space-y-2">
                      <li><Link to="/user/profile" className="text-gray-600 hover:text-crocus-500">My Profile</Link></li>
                      <li><Link to="/user/orders" className="text-gray-600 hover:text-crocus-500">Order History</Link></li>
                      <li><Link to="/user/cart" className="text-gray-600 hover:text-crocus-500">Shopping Cart</Link></li>
                      <li><Link to="/auth/login" className="text-gray-600 hover:text-crocus-500">Login / Register</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-crocus-700">Connect With Us</h3>
                    <ul className="space-y-2">
                      <li><Link to="/contact" className="text-gray-600 hover:text-crocus-500">Contact Us</Link></li>
                      <li><a href="#" className="text-gray-600 hover:text-crocus-500">About Us</a></li>
                    </ul>
                    <div className="flex space-x-4 mt-4">
                      <a href="#" className="text-gray-600 hover:text-crocus-500">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-crocus-500">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.045-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344 1.054.048 1.37.058 4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-crocus-500">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                  <p className="text-gray-600">© 2025 CROCUS Fashion. All rights reserved.</p>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};
