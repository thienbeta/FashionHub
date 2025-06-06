
import { Bell, Search, User, LogOut, Settings as SettingsIcon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
    <header className="h-14 md:h-16 border-b border-gray-200 flex items-center justify-between px-3 md:px-6 sticky top-0 bg-white/80 backdrop-blur-sm z-20">
      {/* Title - responsive sizing */}
      <div className="flex items-center min-w-0 flex-1">
        <h1 className="text-base md:text-xl font-semibold truncate pr-2">{title}</h1>
      </div>
      
      <div className="flex items-center gap-1 md:gap-4">
        {/* Search - adaptive sizing */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="search" 
            placeholder="Tìm kiếm..." 
            className="pl-8 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-crocus-500 h-8 w-32 sm:w-48 md:h-10 md:w-72 text-sm" 
          />
        </div>

        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications - responsive sizing */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-10 md:w-10">
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 md:h-4 md:w-4 items-center justify-center rounded-full bg-crocus-500 text-[8px] md:text-[10px] text-white font-medium">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 md:w-80 mr-1 md:mr-0">
            <DropdownMenuLabel className="text-sm md:text-base">Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-60 md:max-h-80 overflow-y-auto">
              {[1, 2, 3].map(i => (
                <DropdownMenuItem key={i} className="cursor-pointer py-2 md:py-3">
                  <div className="flex gap-3 md:gap-4 w-full">
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-crocus-50 flex items-center justify-center shrink-0">
                      <Bell className="h-3 w-3 md:h-4 md:w-4 text-crocus-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs md:text-sm truncate">Đơn hàng mới #{1000 + i}</p>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">Khách hàng đã đặt một đơn hàng trị giá $199</p>
                      <p className="text-xs text-gray-500 mt-1">10 phút trước</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu - responsive sizing */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 md:h-10 md:w-10">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 md:w-56 mr-1 md:mr-0">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm md:text-base font-medium">Tài khoản của tôi</p>
                <p className="text-xs text-gray-500 truncate">
                  {localStorage.getItem("adminEmail") || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 text-sm" onClick={handleLogout}>
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
