
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";

const StaffOrders = () => {
  return (
    <div className="py-10 space-y-8">
      <h1 className="text-3xl font-bold">Orders</h1>

      <div className="flex items-center gap-4">
        <Input placeholder="Search orders..." className="max-w-sm" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">#12345</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>3 items</span>
                </div>
              </TableCell>
              <TableCell>$299.97</TableCell>
              <TableCell>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  Processing
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffOrders;
