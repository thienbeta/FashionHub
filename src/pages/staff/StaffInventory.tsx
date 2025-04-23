
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";

const StaffInventory = () => {
  return (
    <div className="py-10 space-y-8">
      <h1 className="text-3xl font-bold">Inventory</h1>

      <div className="flex items-center gap-4">
        <Input placeholder="Search inventory..." className="max-w-sm" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>In Stock</TableHead>
              <TableHead>Reserved</TableHead>
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
              <TableCell>50</TableCell>
              <TableCell>5</TableCell>
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

export default StaffInventory;
