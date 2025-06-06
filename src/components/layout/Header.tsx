
import { Bell, Search, User, LogOut, Settings as SettingsIcon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    toast.success("Đăng xuất thành công");
    navigate("/auth/login");
  };
  
  return (
    <header className="h-12 sm:h-14 md:h-16 border-b border-gray-200 flex items-center justify-between px-2 sm:px-4 md:px-6 sticky top-0 bg-white/95 backdrop-blur-sm z-30">
      {/* Left section with menu and title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden h-8 w-8 shrink-0"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-sm sm:text-base md:text-xl font-semibold truncate text-gray-900">
          {title}
        </h1>
      </div>
      
      {/* Right section with controls */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
        {/* Search - adaptive visibility */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="search" 
            placeholder="Tìm kiếm..." 
            className="pl-8 bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-crocus-500 h-9 w-48 lg:w-64 xl:w-72 text-sm placeholder:text-gray-500" 
          />
        </div>

        {/* Search button for tablet */}
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications - responsive */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-crocus-500 text-[10px] text-white font-medium">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80 mr-1 max-h-96 overflow-y-auto">
            <DropdownMenuLabel className="text-sm font-medium">Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1">
              {[1, 2, 3].map(i => (
                <DropdownMenuItem key={i} className="cursor-pointer p-3 focus:bg-gray-50">
                  <div className="flex gap-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-crocus-50 flex items-center justify-center shrink-0">
                      <Bell className="h-3 w-3 text-crocus-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-gray-900">Đơn hàng mới #{1000 + i}</p>
                      <p className="text-xs text-gray-600 mt-1">Khách hàng đã đặt đơn hàng trị giá $199</p>
                      <p className="text-xs text-gray-500 mt-1">10 phút trước</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu - responsive */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 md:h-9 md:w-9">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-56 mr-1">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-gray-900">Tài khoản</p>
                <p className="text-xs text-gray-600 truncate">
                  {localStorage.getItem("adminEmail") || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm p-3 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm p-3 cursor-pointer">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 text-sm p-3 cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
