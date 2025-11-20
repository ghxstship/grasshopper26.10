'use client';

import { useState} from 'react';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { Input} from '@/components/atoms/Input';
import { Select} from '@/components/atoms/Select';
import { FormField} from '@/components/molecules/FormField';
import { Alert} from '@/components/molecules/Alert';
import { Separator} from '@/components/atoms/Separator';
import { SectionHeader, SubsectionHeader, BodyText, BodyTextSmall,
 Metadata} from '@/components/atoms/Typography';
import { Lock, Trash2, Plus, Minus } from 'lucide-react'
import { useRouter} from 'next/navigation';

interface CartItem {
 id: string;
 name: string;
 price: number;
 quantity: number;
 image?: string;
 eventDate?: string;
}

export default function CheckoutPage() {
 const router = useRouter();
 const [isProcessing, setIsProcessing] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [cartItems, setCartItems] = useState<CartItem[]>([
 {
 id: '1',
 name: 'Premium Event Ticket',
 price: 99.99,
 quantity: 2,
 eventDate: '2024-12-15'
},
 {
 id: '2',
 name: 'VIP Access Pass',
 price: 149.99,
 quantity: 1,
 eventDate: '2024-12-20'
}
 ]);

 const [formData, setFormData] = useState({
 email: '',
 cardNumber: '',
 cardName: '',
 expiryDate: '',
 cvv: '',
 billingAddress: '',
 city: '',
 state: '',
 zipCode: '',
 country: 'US'
});

 const updateQuantity = (id: string, delta: number) => {
 setCartItems(items =>
 items.map(item =>
 item.id === id
 ? { ...item, quantity: Math.max(1, item.quantity + delta)}
 : item
 )
 );
};

 const removeItem = (id: string) => {
 setCartItems(items => items.filter(item => item.id !== id));
};

 const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
 const tax = subtotal * 0.08;
 const total = subtotal + tax;

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError(null);
 setIsProcessing(true);

 try {
 // Simulate payment processing
 await new Promise(resolve => setTimeout(resolve, 2000));
 // Redirect to success page
 router.push('/checkout/success');
} catch {
 setError('Payment processing failed. Please try again.');
} finally {
 setIsProcessing(false);
}
};

 const handleInputChange = (field: string, value: string) => {
 setFormData(prev => ({ ...prev, [field]: value}));
};

 return (
 <GvtewayLayout>
 <ContentLayout
 title="Checkout"
 description="Complete your purchase securely"
 breadcrumbs={[
 { label: 'Home', href: '/'},
 { label: 'Cart', href: '/cart'},
 { label: 'Checkout'}
 ]}
 variant="gvteway"
 >
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Main Checkout Form */}
 <div className="lg:col-span-2 space-y-6">
 {error && (
 <Alert
 variant="error"
 title="Payment Error"
 onClose={() => setError(null)}
 >
 {error}
 </Alert>
 )}

 <form onSubmit={handleSubmit} className="space-y-6">
 {/* Contact Information */}
 <Card variant="gvteway">
 <CardHeader>
 <CardTitle>Contact Information</CardTitle>
 <CardDescription>
 We&apos;ll send your tickets to this email address
 </CardDescription>
 </CardHeader>
 <CardContent>
 <FormField
 label="Email Address"
 required
 hint="Your order confirmation will be sent here"
 >
 <Input
 type="email"
 placeholder="you@example.com"
 value={formData.email}
 onChange={(e) => handleInputChange('email', e.target.value)}
 required
 variant="gvteway"
 />
 </FormField>
 </CardContent>
 </Card>

 {/* Payment Information */}
 <Card variant="gvteway">
 <CardHeader>
 <div className="flex items-center justify-between">
 <div>
 <CardTitle>Payment Information</CardTitle>
 <CardDescription>
 All transactions are secure and encrypted
 </CardDescription>
 </div>
 <Lock className="h-5 w-5 text-gvteway-red-500" />
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <FormField label="Card Number" required>
 <Input
 type="text"
 placeholder="1234 5678 9012 3456"
 value={formData.cardNumber}
 onChange={(e) => handleInputChange('cardNumber', e.target.value)}
 maxLength={19}
 required
 variant="gvteway"
 />
 </FormField>

 <FormField label="Cardholder Name" required>
 <Input
 type="text"
 placeholder="John Doe"
 value={formData.cardName}
 onChange={(e) => handleInputChange('cardName', e.target.value)}
 required
 variant="gvteway"
 />
 </FormField>

 <div className="grid grid-cols-2 gap-4">
 <FormField label="Expiry Date" required>
 <Input
 type="text"
 placeholder="MM/YY"
 value={formData.expiryDate}
 onChange={(e) => handleInputChange('expiryDate', e.target.value)}
 maxLength={5}
 required
 variant="gvteway"
 />
 </FormField>

 <FormField label="CVV" required>
 <Input
 type="text"
 placeholder="123"
 value={formData.cvv}
 onChange={(e) => handleInputChange('cvv', e.target.value)}
 maxLength={4}
 required
 variant="gvteway"
 />
 </FormField>
 </div>
 </CardContent>
 </Card>

 {/* Billing Address */}
 <Card variant="gvteway">
 <CardHeader>
 <CardTitle>Billing Address</CardTitle>
 <CardDescription>
 Enter the address associated with your payment method
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <FormField label="Street Address" required>
 <Input
 type="text"
 placeholder="123 Main St"
 value={formData.billingAddress}
 onChange={(e) => handleInputChange('billingAddress', e.target.value)}
 required
 variant="gvteway"
 />
 </FormField>

 <div className="grid grid-cols-2 gap-4">
 <FormField label="City" required>
 <Input
 type="text"
 placeholder="New York"
 value={formData.city}
 onChange={(e) => handleInputChange('city', e.target.value)}
 required
 variant="gvteway"
 />
 </FormField>

 <FormField label="State" required>
 <Input
 type="text"
 placeholder="NY"
 value={formData.state}
 onChange={(e) => handleInputChange('state', e.target.value)}
 required
 variant="gvteway"
 />
 </FormField>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <FormField label="ZIP Code" required>
 <Input
 type="text"
 placeholder="10001"
 value={formData.zipCode}
 onChange={(e) => handleInputChange('zipCode', e.target.value)}
 required
 variant="gvteway"
 />
 </FormField>

 <FormField label="Country" required>
 <Select
 value={formData.country}
 onChange={(e) => handleInputChange('country', e.target.value)}
 required
 variant="gvteway"
 >
 <option value="US">United States</option>
 <option value="CA">Canada</option>
 <option value="UK">United Kingdom</option>
 <option value="AU">Australia</option>
 </Select>
 </FormField>
 </div>
 </CardContent>
 </Card>
 </form>
 </div>

 {/* Order Summary Sidebar */}
 <div className="lg:col-span-1">
 <div className="sticky top-6 space-y-6">
 <Card variant="gvteway">
 <CardHeader>
 <CardTitle>Order Summary</CardTitle>
 <CardDescription>
 {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 {/* Cart Items */}
 <div className="space-y-3">
 {cartItems.map((item) => (
 <div key={item.id} className="space-y-2">
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <BodyText className="mb-1">{item.name}</BodyText>
 {item.eventDate && (
 <Metadata>
 Event: {new Date(item.eventDate).toLocaleDateString()}
 </Metadata>
 )}
 </div>
 <Button
 variant="ghost"
 size="icon"
 onClick={() => removeItem(item.id)}
 type="button"
 >
 <Trash2 className="h-4 w-4" />
 </Button>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="icon"
 onClick={() => updateQuantity(item.id, -1)}
 disabled={item.quantity <= 1}
 type="button"
 >
 <Minus className="h-3 w-3" />
 </Button>
 <BodyTextSmall className="w-8 text-center mb-0">
 {item.quantity}
 </BodyTextSmall>
 <Button
 variant="outline"
 size="icon"
 onClick={() => updateQuantity(item.id, 1)}
 type="button"
 >
 <Plus className="h-3 w-3" />
 </Button>
 </div>
 <BodyText className="mb-0">
 ${(item.price * item.quantity).toFixed(2)}
 </BodyText>
 </div>
 {item.id !== cartItems[cartItems.length - 1].id && (
 <Separator className="mt-3" />
 )}
 </div>
 ))}
 </div>

 <Separator />

 {/* Price Breakdown */}
 <div className="space-y-2">
 <div className="flex justify-between">
 <BodyTextSmall className="mb-0">Subtotal</BodyTextSmall>
 <BodyTextSmall className="mb-0">${subtotal.toFixed(2)}</BodyTextSmall>
 </div>
 <div className="flex justify-between">
 <BodyTextSmall className="mb-0">Tax (8%)</BodyTextSmall>
 <BodyTextSmall className="mb-0">${tax.toFixed(2)}</BodyTextSmall>
 </div>
 <Separator />
 <div className="flex justify-between">
 <SectionHeader>Total</SectionHeader>
 <SectionHeader className="text-gvteway-red-500">
 ${total.toFixed(2)}
 </SectionHeader>
 </div>
 </div>
 </CardContent>
 <CardFooter className="flex-col gap-3">
 <BodyTextSmall className="text-center mb-0">
 <Lock className="inline h-3 w-3 me-1" />
 Secure checkout powered by Stripe
 </BodyTextSmall>
 </CardFooter>
 </Card>

 {/* Security Badge */}
 <Card variant="glass">
 <CardContent className="pt-6">
 <div className="flex items-start gap-3">
 <Lock className="h-5 w-5 text-gvteway-red-500 flex-shrink-0 mt-1" />
 <div>
 <SubsectionHeader className="mb-2">Secure Payment</SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Your payment information is encrypted and secure. We never store your card details.
 </BodyTextSmall>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
