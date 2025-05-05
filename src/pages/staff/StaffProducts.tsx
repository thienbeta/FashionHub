
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus, Search, Filter, ArrowDownToLine } from "lucide-react";
import { FormSidebar } from "@/components/forms/FormSidebar";

const StaffProducts = () => {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-48px)]">
      {/* Form Sidebar */}
      <FormSidebar activeFormId="products" />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Products</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product 
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search products..." className="pl-9 w-full" />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <ArrowDownToLine className="h-4 w-4 mr-1" /> Export
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(10).fill(0).map((_, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-purple-500" />
                        <span>Product Name {index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>SKU-{12345 + index}</TableCell>
                    <TableCell>${(99.99 - index).toFixed(2)}</TableCell>
                    <TableCell>{50 - index * 5}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        index % 3 === 0 
                          ? "bg-green-100 text-green-800" 
                          : index % 3 === 1 
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      )}>
                        {index % 3 === 0 ? "In Stock" : index % 3 === 1 ? "Low Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProducts;
