import { Bell, Search, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/pages/ui/button';
import { Input } from '@/pages/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/pages/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
 
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    toast.success("Đăng xuất thành công");
    navigate("/auth/login");
  };
 
  return (
    <header className="h-16 border-b border-purple-200/50 flex items-center justify-between px-6 sticky top-0 bg-gradient-to-r from-purple-600/95 via-purple-500/95 to-red-500/95 backdrop-blur-lg z-20 shadow-lg shadow-purple-500/25">
      <h1 className="text-xl font-bold text-white drop-shadow-md bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
        {title}
      </h1>
     
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative max-w-xs w-72 hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            className="pl-10 bg-white/20 border border-white/30 text-white placeholder:text-purple-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:border-white/50 backdrop-blur-sm shadow-md rounded-lg transition-all duration-200 hover:bg-white/25"
          />
        </div>

        {/* Notification Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white shadow-xl border-purple-200/50 rounded-xl">
            <DropdownMenuLabel className="text-purple-600 font-semibold">
              Thông báo
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-purple-100" />
            <DropdownMenuItem className="hover:bg-purple-50 text-gray-600">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Không có thông báo mới</p>
                <p className="text-xs text-gray-500">Bạn đã xem tất cả thông báo</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border-purple-200/50 rounded-xl">
            <DropdownMenuLabel className="font-normal bg-gradient-to-r from-purple-50 to-red-50 rounded-t-lg">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-base font-semibold text-purple-700">Tài khoản của tôi</p>
                <p className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-md font-medium">
                  {localStorage.getItem("adminEmail") || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-purple-100" />
            
            <DropdownMenuItem className="hover:bg-purple-50 text-gray-700 transition-colors duration-150">
              <User className="mr-3 h-4 w-4 text-purple-500" />
              <span className="font-medium">Hồ sơ</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="hover:bg-purple-50 text-gray-700 transition-colors duration-150">
              <SettingsIcon className="mr-3 h-4 w-4 text-purple-500" />
              <span className="font-medium">Cài đặt</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-red-100" />
            
            <DropdownMenuItem 
              className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;