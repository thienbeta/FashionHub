
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Package, 
  Filter,
  RefreshCw,
  Download,
  ArrowUpDown
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Product = {
  id: string;
  name: string;
  sku: string;
  inStock: number;
  reserved: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  category: string;
  location: string;
};

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Purple T-Shirt",
    sku: "TSH-1001",
    inStock: 50,
    reserved: 5,
    status: "In Stock",
    category: "Clothing",
    location: "Warehouse A"
  },
  {
    id: "2",
    name: "Designer Jeans",
    sku: "DNJ-2045",
    inStock: 35,
    reserved: 10,
    status: "In Stock",
    category: "Clothing",
    location: "Warehouse A"
  },
  {
    id: "3",
    name: "Leather Wallet",
    sku: "ACC-3078",
    inStock: 12,
    reserved: 3,
    status: "Low Stock",
    category: "Accessories",
    location: "Warehouse B"
  },
  {
    id: "4",
    name: "Running Shoes",
    sku: "SHO-4123",
    inStock: 0,
    reserved: 0,
    status: "Out of Stock",
    category: "Footwear",
    location: "Warehouse C"
  },
  {
    id: "5",
    name: "Watch Classic",
    sku: "WAT-5002",
    inStock: 8,
    reserved: 2,
    status: "Low Stock",
    category: "Accessories",
    location: "Warehouse B"
  }
];

const StaffInventory = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [openProductForm, setOpenProductForm] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      sku: "",
      quantity: "",
      category: "",
      location: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    // In a real app, this would be an API call
    const newProduct: Product = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      sku: data.sku,
      inStock: parseInt(data.quantity),
      reserved: 0,
      status: parseInt(data.quantity) > 10 ? "In Stock" : parseInt(data.quantity) > 0 ? "Low Stock" : "Out of Stock",
      category: data.category,
      location: data.location,
    };
    
    setProducts([...products, newProduct]);
    setOpenProductForm(false);
    form.reset();
  });

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-gray-500">Track and manage your product inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-gray-700">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-gray-700">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{products.filter(p => p.status === "Low Stock").length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-gray-700">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{products.filter(p => p.status === "Out of Stock").length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search by product name or SKU..." 
            className="pl-9 w-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2" size="sm">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" size="sm">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" size="sm">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Dialog open={openProductForm} onOpenChange={setOpenProductForm}>
            <DialogTrigger asChild>
              <Button className="gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SKU number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Clothing">Clothing</SelectItem>
                              <SelectItem value="Footwear">Footwear</SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                              <SelectItem value="Electronics">Electronics</SelectItem>
                              <SelectItem value="Home">Home</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                              <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                              <SelectItem value="Warehouse C">Warehouse C</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpenProductForm(false)}>Cancel</Button>
                    <Button type="submit">Save Product</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <div className="flex items-center gap-2">
                  Product
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead className="text-right">Reserved</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-purple-500" />
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell className="text-right">{product.inStock}</TableCell>
                  <TableCell className="text-right">{product.reserved}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={
                      product.status === "In Stock" ? "default" : 
                      product.status === "Low Stock" ? "secondary" : "destructive"
                    } className={
                      product.status === "In Stock" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                      product.status === "Low Stock" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : 
                      "bg-red-100 text-red-800 hover:bg-red-200"
                    }>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.location}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No products found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="py-3 px-4 bg-gray-50 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> products
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

export default StaffInventory;
