
import React from "react";
import { RefreshCw, ArrowRight, ExternalLink, ChevronDown, Code, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavigationBarProps {
  className?: string;
}

export const NavigationBar = ({ className }: NavigationBarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Extract the path components for route display
  const pathSegments = currentPath.split('/').filter(Boolean);
  const displayPath = pathSegments.length > 0 ? `${pathSegments.join('/')}` : 'home';
  
  return (
    <div className={cn(
      "h-12 border-b border-gray-200 bg-white flex items-center justify-between px-2 md:px-4",
      className
    )}>
      {/* Left section: Navigation controls */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100" title="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100" title="Forward">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Middle section: Current path */}
      <div className="flex-1 flex justify-center">
        <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5 max-w-md">
          <span className="text-sm text-gray-800 font-medium truncate">
            {displayPath}
          </span>
          <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
        </div>
      </div>
      
      {/* Right section: Actions */}
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100" title="Code">
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100" title="GitHub">
            <Github className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
          Invite
        </Button>
        
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
          Publish
        </Button>
      </div>
    </div>
  );
};
