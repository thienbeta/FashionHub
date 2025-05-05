
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package } from "lucide-react";
import { useBreakpoint } from "@/hooks/use-mobile";

const StaffOrders = () => {
  const isMobile = useBreakpoint("mobile");
  
  return (
    <div className="py-6 space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search orders..." 
              className="pl-9 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[15%]">Order ID</TableHead>
                <TableHead className="w-[25%]">Customer</TableHead>
                <TableHead className="w-[25%]">Products</TableHead>
                <TableHead className="w-[15%]">Total</TableHead>
                <TableHead className="w-[20%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="font-medium">#12345</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-1 rounded">
                      <Package className="h-4 w-4 text-purple-500" />
                    </div>
                    <span>3 items</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">${(299.97).toFixed(2)}</TableCell>
                <TableCell>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                    Processing
                  </span>
                </TableCell>
              </TableRow>
              
              <TableRow className="hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="font-medium">#12346</TableCell>
                <TableCell>Jane Smith</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-1 rounded">
                      <Package className="h-4 w-4 text-purple-500" />
                    </div>
                    <span>1 item</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">${(129.99).toFixed(2)}</TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Delivered
                  </span>
                </TableCell>
              </TableRow>
              
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium">#12347</TableCell>
                <TableCell>Robert Johnson</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-1 rounded">
                      <Package className="h-4 w-4 text-purple-500" />
                    </div>
                    <span>2 items</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">${(249.98).toFixed(2)}</TableCell>
                <TableCell>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    Shipped
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StaffOrders;
