
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

const AdminUsers = () => {
  return (
    <div className="py-10 space-y-8">
      <h1 className="text-3xl font-bold">Users</h1>

      <div className="flex items-center gap-4">
        <Input placeholder="Search users..." className="max-w-sm" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>John Doe</span>
                </div>
              </TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>User</TableCell>
              <TableCell>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Active
                </span>
              </TableCell>
              <TableCell>Jan 1, 2024</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
