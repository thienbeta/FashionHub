
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  FileText, 
  Filter,
  Download,
  ArrowUpDown,
  Eye,
  Printer,
  Mail
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

type Invoice = {
  id: string;
  number: string;
  customer: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
};

const mockInvoices: Invoice[] = [
  {
    id: "1",
    number: "INV-2025-001",
    customer: "Sarah Miller",
    date: "May 4, 2025",
    amount: 1250.00,
    status: "Paid"
  },
  {
    id: "2",
    number: "INV-2025-002",
    customer: "Alex Johnson",
    date: "May 3, 2025",
    amount: 845.50,
    status: "Paid"
  },
  {
    id: "3",
    number: "INV-2025-003",
    customer: "Michael Brown",
    date: "May 2, 2025",
    amount: 1678.25,
    status: "Pending"
  },
  {
    id: "4",
    number: "INV-2025-004",
    customer: "Emma Wilson",
    date: "April 29, 2025",
    amount: 530.75,
    status: "Overdue"
  },
  {
    id: "5",
    number: "INV-2025-005",
    customer: "James Taylor",
    date: "April 28, 2025",
    amount: 922.00,
    status: "Pending"
  }
];

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === "Paid").length;
  const pendingInvoices = invoices.filter(invoice => invoice.status === "Pending").length;
  const overdueInvoices = invoices.filter(invoice => invoice.status === "Overdue").length;

  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <p className="text-gray-500">Manage and track your customer invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{paidInvoices}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-700">{pendingInvoices}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Overdue Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">{overdueInvoices}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-auto max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search invoices..." 
            className="pl-9 w-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2" size="sm">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2" size="sm">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            <span>New Invoice</span>
          </Button>
        </div>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[200px]">
                <div className="flex items-center gap-2">
                  Invoice
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map(invoice => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span>{invoice.number}</span>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={
                      invoice.status === "Paid" ? "default" : 
                      invoice.status === "Pending" ? "secondary" : "destructive"
                    } className={
                      invoice.status === "Paid" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                      invoice.status === "Pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : 
                      "bg-red-100 text-red-800 hover:bg-red-200"
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-500">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No invoices found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="py-3 px-4 bg-gray-50 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredInvoices.length}</span> of <span className="font-medium">{invoices.length}</span> invoices
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices;
