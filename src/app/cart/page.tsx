'use client';

import { useState, useEffect} from 'react';
import { useRouter} from 'next/navigation';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { Badge} from '@/components/atoms/Badge';
import { Spinner} from '@/components/atoms/Spinner';
import { Input} from '@/components/atoms/Input';
import { BodyTextSmall, SubsectionHeader,
 Metadata
} from '@/components/atoms/Typography';
import { Alert} from '@/components/molecules/Alert';
import { EmptyState} from '@/components/molecules/EmptyState';
import { ShoppingCart, Trash2, Plus, Minus,
 CreditCard,
 ArrowRight,
 Package,
 Tag,
 Gift
} from 'lucide-react';

interface CartItem {
 id: string;
 name: string;
 description: string;
 price: number;
 quantity: number;
 image?: string;
 category: string;
 inStock: boolean;
 maxQuantity: number;
}

export default function CartPage() {
 const router = useRouter();
 const [cartItems, setCartItems] = useState<CartItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [showAlert, setShowAlert] = useState(false);
 const [alertMessage, setAlertMessage] = useState('');
 const [alertVariant, setAlertVariant] = useState<'success' | 'error' | 'warning'>('success');
 const [promoCode, setPromoCode] = useState('');
 const [discount, setDiscount] = useState(0);

 useEffect(() => {
 // Simulate fetching cart data
 const fetchCart = async () => {
 setLoading(true);
 try {
 // Mock data - replace with actual API call
 await new Promise(resolve => setTimeout(resolve, 800));
 setCartItems([
 {
 id: '1',
 name: 'Premium Event Ticket',
 description: 'VIP access with backstage pass',
 price: 299.99,
 quantity: 2,
 category: 'Events',
 inStock: true,
 maxQuantity: 5
},
 {
 id: '2',
 name: 'Concert Merchandise Bundle',
 description: 'Limited edition t-shirt and poster',
 price: 79.99,
 quantity: 1,
 category: 'Merchandise',
 inStock: true,
 maxQuantity: 10
},
 {
 id: '3',
 name: 'Meet & Greet Package',
 description: 'Exclusive meet and greet opportunity',
 price: 499.99,
 quantity: 1,
 category: 'Experiences',
 inStock: false,
 maxQuantity: 2
}
 ]);
} catch (error) {
 console.error('Failed to fetch cart:', error);
 setAlertMessage('Failed to load cart items');
 setAlertVariant('error');
 setShowAlert(true);
} finally {
 setLoading(false);
}
};

 fetchCart();
}, []);

 const updateQuantity = (itemId: string, newQuantity: number) => {
 setCartItems(prevItems =>
 prevItems.map(item => {
 if (item.id === itemId) {
 if (newQuantity < 1) return { ...item, quantity: 1};
 if (newQuantity > item.maxQuantity) {
 setAlertMessage(`Maximum quantity for ${item.name} is ${item.maxQuantity}`);
 setAlertVariant('warning');
 setShowAlert(true);
 return { ...item, quantity: item.maxQuantity};
}
 return { ...item, quantity: newQuantity};
}
 return item;
})
 );
};

 const removeItem = (itemId: string) => {
 const item = cartItems.find(i => i.id === itemId);
 setCartItems(prevItems => prevItems.filter(i => i.id !== itemId));
 setAlertMessage(`${item?.name || 'Item'} removed from cart`);
 setAlertVariant('success');
 setShowAlert(true);
};

 const applyPromoCode = () => {
 if (promoCode.toUpperCase() === 'SAVE10') {
 setDiscount(0.10);
 setAlertMessage('Promo code applied! 10% discount');
 setAlertVariant('success');
 setShowAlert(true);
} else if (promoCode.toUpperCase() === 'SAVE20') {
 setDiscount(0.20);
 setAlertMessage('Promo code applied! 20% discount');
 setAlertVariant('success');
 setShowAlert(true);
} else {
 setAlertMessage('Invalid promo code');
 setAlertVariant('error');
 setShowAlert(true);
}
};

 const clearCart = () => {
 setCartItems([]);
 setAlertMessage('Cart cleared');
 setAlertVariant('success');
 setShowAlert(true);
};

 const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
 const discountAmount = subtotal * discount;
 const tax = (subtotal - discountAmount) * 0.08; // 8% tax
 const total = subtotal - discountAmount + tax;

 if (loading) {
 return (
 <GvtewayLayout>
 <ContentLayout
 title="Shopping Cart"
 description="Loading your cart items"
 breadcrumbs={[
 { label:"Home", href:"/"},
 { label:"Cart"}
 ]}
 variant="gvteway"
 >
 <div className="flex items-center justify-center min-h-[400px]">
 <Spinner variant="gvteway" size="lg" />
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}

 if (cartItems.length === 0) {
 return (
 <GvtewayLayout>
 <ContentLayout
 title="Shopping Cart"
 description="Your cart is empty"
 breadcrumbs={[
 { label:"Home", href:"/"},
 { label:"Cart"}
 ]}
 variant="gvteway"
 >
 <EmptyState
 icon={<ShoppingCart className="h-16 w-16" />}
 title="Your cart is empty"
 message="Add some items to your cart to get started"
 actionLabel="Browse Marketplace"
 onAction={() => router.push('/marketplace')}
 variant="gvteway"
 />
 </ContentLayout>
 </GvtewayLayout>
 );
}

 return (
 <GvtewayLayout>
 <ContentLayout
 title="Shopping Cart"
 description={`${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart`}
 breadcrumbs={[
 { label:"Home", href:"/"},
 { label:"Cart"}
 ]}
 variant="gvteway"
 primaryAction={{
 label:"Continue Shopping",
 onClick: () => router.push('/marketplace'),
 variant:"outline"
}}
 >
 {showAlert && (
 <Alert
 variant={alertVariant}
 title={alertVariant === 'success' ? 'Success' : alertVariant === 'error' ? 'Error' : 'Warning'}
 onClose={() => setShowAlert(false)}
 className="mb-6"
 >
 {alertMessage}
 </Alert>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Cart Items */}
 <div className="lg:col-span-2 space-y-4">
 {cartItems.map((item) => (
 <Card key={item.id} variant="gvteway">
 <CardContent className="p-6">
 <div className="flex flex-col md:flex-row gap-6">
 {/* Item Image */}
 <div className="w-full md:w-32 h-32 bg-black/10/10/10 rounded-xl flex items-center justify-center border-2 border-gvteway-red-500/20 flex-shrink-0">
 <Package className="h-12 w-12 text-gvteway-red-500/40" />
 </div>

 {/* Item Details */}
 <div className="flex-1 space-y-3">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-1">
 <SubsectionHeader className="cursor-pointer hover:text-gvteway-red-500 transition-colors"
 onClick={() => router.push(`/cart/items/${item.id}`)}
 >
 {item.name}
 </SubsectionHeader>
 <Badge variant={item.inStock ?"success" :"error"}>
 {item.inStock ?"In Stock" :"Out of Stock"}
 </Badge>
 </div>
 <BodyTextSmall className="mb-2">
 {item.description}
 </BodyTextSmall>
 <Metadata>
 Category: {item.category}
 </Metadata>
 </div>
 <Package className="h-12 w-12 text-gvteway-red-500/40" />
 </div>

 {/* Item Details */}
 <div className="flex-1 space-y-3">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-1">
 <SubsectionHeader className="cursor-pointer hover:text-gvteway-red-500 transition-colors"
 onClick={() => router.push(`/cart/items/${item.id}`)}
 <div className="flex items-center justify-between gap-4 pt-3 border-t-2">
 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="icon"
 onClick={() => updateQuantity(item.id, item.quantity - 1)}
 disabled={item.quantity <= 1}
 >
 <Minus className="h-4 w-4" />
 </Button>
 <Input
 type="number"
 value={item.quantity}
 onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
 className="w-16 text-center"
 min={1}
 max={item.maxQuantity}
 />
 <Button
 variant="outline"
 size="icon"
 onClick={() => updateQuantity(item.id, item.quantity + 1)}
 disabled={item.quantity >= item.maxQuantity}
 >
 <Plus className="h-4 w-4" />
 </Button>
 </div>
 <div className="text-right">
 <BodyTextSmall>
 ${item.price.toFixed(2)} each
 </BodyTextSmall>
 <SubsectionHeader className="text-gvteway-red-500">
 ${(item.price * item.quantity).toFixed(2)}
 </SubsectionHeader>
 </div></div>
 </div>
 </CardContent>
 </Card>
 ))}

 {/* Clear Cart Button */}
 <Card variant="gvteway">
 <CardContent className="p-4">
 <Button
 variant="outline"
 onClick={clearCart}
 className="w-full text-error hover:text-error hover:border-error"
 >
 <Trash2 className="h-4 w-4 me-2" />
 Clear Cart
 </Button>
 </CardContent>
 </Card>
 </div>

 {/* Order Summary */}
 <div className="lg:col-span-1">
 <div className="sticky top-6 space-y-4">
 {/* Promo Code */}
 <Card variant="gvteway">
 <CardHeader>
 <CardTitle>Promo Code</CardTitle>
 <CardDescription>
 <Metadata>Enter your promo code</Metadata>
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-3">
 <div className="flex gap-2">
 <Input
 placeholder="Enter code"
 value={promoCode}
 onChange={(e) => setPromoCode(e.target.value)}
 className="flex-1"
 />
 <Button variant="gvteway" onClick={applyPromoCode}
 >
 <Tag className="h-4 w-4 me-2" />
 Apply
 </Button>
 </div>
 {discount > 0 && (
 <div className="flex items-center gap-2 text-success">
 <Gift className="h-4 w-4" />
 <BodyTextSmall >
 {(discount * 100).toFixed(0)}% discount applied!
 </BodyTextSmall>
 </div>
 )}
 </CardContent>
 </Card>

 {/* Order Summary */}
 <Card variant="gvteway">
 <CardHeader>
 <CardTitle>Order Summary</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <div className="space-y-2">
 <div className="flex justify-between">
 <BodyTextSmall>Subtotal:</BodyTextSmall>
 <BodyTextSmall >
 ${subtotal.toFixed(2)}
 </BodyTextSmall>
 </div>
 {discount > 0 && (
 <div className="flex justify-between text-success">
 <BodyTextSmall>Discount ({(discount * 100).toFixed(0)}%):</BodyTextSmall>
 <BodyTextSmall >
 -${discountAmount.toFixed(2)}
 </BodyTextSmall>
 </div>
 )}
 <div className="flex justify-between">
 <BodyTextSmall>Tax (8%):</BodyTextSmall>
 <BodyTextSmall >
 ${tax.toFixed(2)}
 </BodyTextSmall>
 </div>
 <div className="border-t-2 pt-2 mt-2">
 <div className="flex justify-between">
 <SubsectionHeader>Total:</SubsectionHeader>
 <SubsectionHeader className="text-gvteway-red-500">
 ${total.toFixed(2)}
 </SubsectionHeader>
 </div></div>

 <BodyTextSmall className="text-center pt-2">
 Free shipping on orders over $500
 </BodyTextSmall>
 </CardContent>
 <CardFooter className="flex-col gap-3">
 <Button variant="gvteway" className="w-full" size="lg"
 onClick={() => router.push('/checkout')}
 >
 <CreditCard className="h-5 w-5 me-2" />
 Proceed to Checkout
 </Button>
 <Button variant="outline" className="w-full"
 onClick={() => router.push('/marketplace')}
 >
 Continue Shopping
 <ArrowRight className="h-4 w-4 ms-2" />
 </Button>
 </CardFooter>
 </Card>

 {/* Trust Badges */}
 <Card variant="gvteway">
 <CardContent className="p-4 space-y-2">
 <div className="flex items-center gap-2">
 <Package className="h-4 w-4" />
 <BodyTextSmall>Secure checkout</BodyTextSmall>
 </div>
 <div className="flex items-center gap-2">
 <CreditCard className="h-4 w-4" />
 <BodyTextSmall>Multiple payment options</BodyTextSmall>
 </div>
 <div className="flex items-center gap-2">
 <Gift className="h-4 w-4" />
 <BodyTextSmall>Easy returns & refunds</BodyTextSmall>
 </div>
 </CardContent>
 </Card>
 </div></div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
