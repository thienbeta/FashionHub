
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus } from "lucide-react";

const StaffProducts = () => {
  return (
    <div className="py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product 
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input placeholder="Search products..." className="max-w-sm" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Product Name</span>
                </div>
              </TableCell>
              <TableCell>SKU-12345</TableCell>
              <TableCell>$99.99</TableCell>
              <TableCell>50</TableCell>
              <TableCell>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  In Stock
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffProducts;
