
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const cartItems = [
  {
    id: 1,
    name: "Crocus Cotton Tee",
    price: 29.99,
    quantity: 1,
  },
  {
    id: 2,
    name: "Linen Blend Shirt",
    price: 49.99,
    quantity: 2,
  },
  {
    id: 3,
    name: "Summer Dress",
    price: 79.99,
    quantity: 1,
  },
];

const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const shipping = 5.99;
const tax = subtotal * 0.1; // 10% tax
const total = subtotal + shipping + tax;

export const CheckoutForm = () => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review' | 'confirmation'>('shipping');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep('review');
    window.scrollTo(0, 0);
  };

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('confirmation');
      window.scrollTo(0, 0);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {step !== 'confirmation' && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' || step === 'payment' || step === 'review' ? 'bg-crocus-500 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className="ml-2">Shipping</div>
            </div>
            <div className="h-0.5 flex-1 bg-gray-200 mx-4" />
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' || step === 'review' ? 'bg-crocus-500 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div className="ml-2">Payment</div>
            </div>
            <div className="h-0.5 flex-1 bg-gray-200 mx-4" />
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-crocus-500 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <div className="ml-2">Review</div>
            </div>
          </div>
        </div>
      )}

      {step === 'shipping' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="shippingForm" onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      required
                      value={shippingInfo.fullName}
                      onChange={handleShippingInfoChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="123 Main St, Apt 4B"
                      required
                      value={shippingInfo.address}
                      onChange={handleShippingInfoChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="New York"
                        required
                        value={shippingInfo.city}
                        onChange={handleShippingInfoChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="NY"
                        required
                        value={shippingInfo.state}
                        onChange={handleShippingInfoChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="10001"
                        required
                        value={shippingInfo.zipCode}
                        onChange={handleShippingInfoChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(123) 456-7890"
                        required
                        value={shippingInfo.phone}
                        onChange={handleShippingInfoChange}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <Link to="/cart">Back to Cart</Link>
                </Button>
                <Button type="submit" form="shippingForm" className="bg-crocus-500 hover:bg-crocus-600">
                  Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="paymentForm" onSubmit={handlePaymentSubmit} className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} required>
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center cursor-pointer w-full">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="vnpay" id="vnpay" />
                      <Label htmlFor="vnpay" className="flex items-center cursor-pointer w-full">
                        <img src="https://via.placeholder.com/40x20" alt="VNPay" className="mr-2" />
                        <span>VNPay</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="zalopay" id="zalopay" />
                      <Label htmlFor="zalopay" className="flex items-center cursor-pointer w-full">
                        <img src="https://via.placeholder.com/40x20" alt="ZaloPay" className="mr-2" />
                        <span>ZaloPay</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center cursor-pointer w-full">
                        <span>Cash on Delivery (COD)</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === 'credit-card' && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('shipping')}>
                  Back
                </Button>
                <Button 
                  type="submit" 
                  form="paymentForm" 
                  className="bg-crocus-500 hover:bg-crocus-600"
                  disabled={!paymentMethod}
                >
                  Continue to Review <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
                <CardDescription>Please verify your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {paymentMethod === 'credit-card' && <p>Credit/Debit Card</p>}
                    {paymentMethod === 'vnpay' && <p>VNPay</p>}
                    {paymentMethod === 'zalopay' && <p>ZaloPay</p>}
                    {paymentMethod === 'cod' && <p>Cash on Delivery (COD)</p>}
                  </div>
                </div>
                
                <form id="reviewForm" onSubmit={handleReviewSubmit}>
                  {/* Hidden form elements if needed */}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('payment')}>
                  Back
                </Button>
                <Button
                  type="submit"
                  form="reviewForm"
                  className="bg-crocus-500 hover:bg-crocus-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Place Order</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {step === 'confirmation' && (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">Order Confirmed!</h2>
              <p className="mt-2 text-gray-600">
                Thank you for your order. We've received your payment and will process your order shortly.
              </p>
              
              <div className="mt-6 border-t border-b py-4">
                <p className="font-medium">Order #12345</p>
                <p className="text-sm text-gray-500 mt-1">A confirmation has been sent to your email.</p>
              </div>
              
              <div className="mt-6 flex gap-4 justify-center">
                <Button asChild className="bg-crocus-500 hover:bg-crocus-600">
                  <Link to="/user/orders">View Order</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
