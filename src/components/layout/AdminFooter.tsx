
import React from "react";
import { Link } from "react-router-dom";
import { Copyright, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-mobile";

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FooterColumn = ({ title, children, className }: FooterColumnProps) => (
  <div className={cn("space-y-3", className)}>
    <h3 className="font-medium text-sm text-gray-700">{title}</h3>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

interface AdminFooterProps {
  className?: string;
  role: "staff" | "admin";
}

export const AdminFooter = ({ className, role }: AdminFooterProps) => {
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");
  
  return (
    <footer className={cn(
      "border-t border-gray-100 bg-gray-50 py-4 px-4 md:px-6 print:hidden",
      className
    )}>
      <div className="container mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-6">
          {/* Company Column */}
          <FooterColumn 
            title="CROCUS Fashion" 
            className="col-span-1 md:col-span-1 lg:col-span-1"
          >
            <p className="text-gray-600 text-xs md:text-sm">
              Bringing you the latest fashion management tools and insights for {role === "admin" ? "administrators" : "staff"}.
            </p>
            <div className="flex items-center space-x-1 text-gray-600 text-xs">
              <Copyright className="h-3 w-3" />
              <span>{new Date().getFullYear()} CROCUS Fashion</span>
            </div>
          </FooterColumn>
          
          {/* Shop Column */}
          <FooterColumn title="Shop">
            <div className="flex flex-col space-y-1.5">
              <Link to="/products" className="text-gray-600 hover:text-purple-600 text-xs md:text-sm">Products</Link>
              <Link to="/combos" className="text-gray-600 hover:text-purple-600 text-xs md:text-sm">Combos</Link>
              <Link to="/products/new" className="text-gray-600 hover:text-purple-600 text-xs md:text-sm">New Arrivals</Link>
            </div>
          </FooterColumn>
          
          {/* Account Column */}
          <FooterColumn title="Account">
            <div className="flex flex-col space-y-1.5">
              <Link to={`/${role}/dashboard`} className="text-gray-600 hover:text-purple-600 text-xs md:text-sm">Dashboard</Link>
              <Link to={`/${role}/orders`} className="text-gray-600 hover:text-purple-600 text-xs md:text-sm">Orders</Link>
              <Link to={`/${role}/products`} className="text-gray-600 hover:text-purple-600 text-xs md:text-sm">Products</Link>
              {role === "admin" && (
                <Link to="/admin/staff" className="text-gray-600 hover:text-purple-600 text-xs md:text-sm">Staff</Link>
              )}
            </div>
          </FooterColumn>
          
          {/* Contact Column */}
          <FooterColumn title="Connect With Us">
            <div className="space-y-2">
              <a href="mailto:support@crocusfashion.com" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 text-xs md:text-sm">
                <Mail className="h-3.5 w-3.5" />
                <span>support@crocusfashion.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 text-xs md:text-sm">
                <Phone className="h-3.5 w-3.5" />
                <span>+1 (234) 567-890</span>
              </a>
              
              <div className="flex space-x-3 pt-1">
                {["facebook", "instagram", "twitter"].map((social) => (
                  <a 
                    key={social} 
                    href={`https://${social}.com/crocusfashion`} 
                    className="bg-white p-1.5 rounded-full border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    aria-label={`Visit our ${social} page`}
                  >
                    <div className="h-3.5 w-3.5 text-gray-600 hover:text-purple-600">
                      {social === "facebook" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      )}
                      {social === "instagram" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      )}
                      {social === "twitter" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </FooterColumn>
        </div>
        
        {/* Bottom footer - Mobile friendly version */}
        {isMobile && (
          <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            All Rights Reserved
          </div>
        )}
      </div>
    </footer>
  );
};
