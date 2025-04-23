
import { useState } from "react";
import { Package, ChevronDown, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* Types defined above */

// Mock data for orders
const orders: Order[] = [
  {
    id: "ORD-12345",
    date: "2025-02-15",
    status: "Delivered",
    total: 159.97,
    items: [
      { name: "Crocus Cotton Tee", quantity: 1, price: 29.99 },
      { name: "Linen Blend Shirt", quantity: 2, price: 49.99 },
    ],
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    trackingNumber: "TRK39571684325",
  },
  {
    id: "ORD-12346",
    date: "2025-02-10",
    status: "Processing",
    total: 79.99,
    items: [
      { name: "Summer Dress", quantity: 1, price: 79.99 },
    ],
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    trackingNumber: null,
  },
  {
    id: "ORD-12347",
    date: "2025-01-28",
    status: "Delivered",
    total: 149.97,
    items: [
      { name: "Winter Jacket", quantity: 1, price: 129.99 },
      { name: "Wool Scarf", quantity: 1, price: 19.98 },
    ],
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    trackingNumber: "TRK49571238472",
  },
];

// Type definitions
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber: string | null;
}

export const OrderHistory = () => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [viewOrderDetails, setViewOrderDetails] = useState<Order | null>(null);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-orange-100 text-orange-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Once you make a purchase, your orders will appear here.</p>
          <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
            <a href="/">Start Shopping</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Order {order.id}</CardTitle>
                  <Badge className={cn("font-medium", getStatusColor(order.status))}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 flex justify-between mt-1">
                  <div>Placed on {formatDate(order.date)}</div>
                  <div className="font-medium">${order.total.toFixed(2)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="flex items-center justify-between cursor-pointer" 
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <span className="text-sm">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                    {expandedOrderId === order.id ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                
                {expandedOrderId === order.id && (
                  <div className="mt-4 space-y-4">
                    <div>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-2 border-t border-gray-100 text-sm">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500 ml-2">×{item.quantity}</span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewOrderDetails(order);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Order Details Dialog */}
      <Dialog open={!!viewOrderDetails} onOpenChange={(open) => !open && setViewOrderDetails(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details - {viewOrderDetails?.id}</DialogTitle>
          </DialogHeader>
          
          {viewOrderDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                  <p>{formatDate(viewOrderDetails.date)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <Badge className={cn("mt-1", getStatusColor(viewOrderDetails.status))}>
                    {viewOrderDetails.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                <div className="bg-gray-50 rounded-md p-3 space-y-2">
                  {viewOrderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">×{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${viewOrderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm">{viewOrderDetails.shippingAddress}</p>
                </div>
              </div>
              
              {viewOrderDetails.trackingNumber && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Tracking Number</h4>
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm">{viewOrderDetails.trackingNumber}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setViewOrderDetails(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
