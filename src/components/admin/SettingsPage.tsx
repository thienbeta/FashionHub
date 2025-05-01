
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Bell, Settings2, Moon, Sun } from "lucide-react";

export function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [brightness, setBrightness] = useState(100);
  const [colorScheme, setColorScheme] = useState<"default" | "warm" | "cool">("default");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [stockAlerts, setStockAlerts] = useState(true);

  // Apply brightness effect
  useEffect(() => {
    document.documentElement.style.filter = `brightness(${brightness}%)`;
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [brightness]);

  // Apply color scheme
  useEffect(() => {
    document.documentElement.classList.remove('color-scheme-warm', 'color-scheme-cool');
    if (colorScheme === 'warm') {
      document.documentElement.classList.add('color-scheme-warm');
    } else if (colorScheme === 'cool') {
      document.documentElement.classList.add('color-scheme-cool');
    }
  }, [colorScheme]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 gap-1">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" /> General
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the admin dashboard looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="theme">Theme Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-1"
                    >
                      <Sun className="h-4 w-4" /> Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-1"
                    >
                      <Moon className="h-4 w-4" /> Dark
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="brightness">Brightness ({brightness}%)</Label>
                </div>
                <Slider
                  id="brightness"
                  min={50}
                  max={150}
                  step={5}
                  defaultValue={[100]}
                  onValueChange={(value) => setBrightness(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <RadioGroup 
                  value={colorScheme} 
                  onValueChange={(value) => setColorScheme(value as "default" | "warm" | "cool")}
                  className="flex flex-col space-y-2 pt-1"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default" className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-crocus-500 mr-2"></span>
                      Default (Crocus)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="warm" id="warm" />
                    <Label htmlFor="warm" className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-amber-500 mr-2"></span>
                      Warm
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="cool" id="cool" />
                    <Label htmlFor="cool" className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-cyan-500 mr-2"></span>
                      Cool
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <Label htmlFor="email_notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="email_notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <Label htmlFor="push_notifications" className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch 
                    id="push_notifications" 
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="order_notifications" className="font-medium">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">Notifications about new and updated orders</p>
                    </div>
                    <Switch 
                      id="order_notifications" 
                      checked={orderNotifications}
                      onCheckedChange={setOrderNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="marketing_notifications" className="font-medium">Marketing</Label>
                      <p className="text-sm text-muted-foreground">Promotions, news, and updates</p>
                    </div>
                    <Switch 
                      id="marketing_notifications" 
                      checked={marketingNotifications}
                      onCheckedChange={setMarketingNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="stock_alerts" className="font-medium">Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">Low stock and out of stock alerts</p>
                    </div>
                    <Switch 
                      id="stock_alerts" 
                      checked={stockAlerts}
                      onCheckedChange={setStockAlerts}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your general account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                General settings will be added here in future updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
}
