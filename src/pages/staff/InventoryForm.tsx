
import React from "react";
import { FormLayout } from "@/components/forms/FormLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InventoryForm = () => {
  return (
    <FormLayout activeFormId="inventory">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Inventory Management</CardTitle>
          <CardDescription>
            Add or update inventory items in your stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" placeholder="Enter product name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="Enter SKU code" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min="0" placeholder="0" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reorder-level">Reorder Level</Label>
                <Input id="reorder-level" type="number" min="0" placeholder="0" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input id="location" placeholder="Enter storage location" />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit">Save Inventory</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormLayout>
  );
};

export default InventoryForm;
