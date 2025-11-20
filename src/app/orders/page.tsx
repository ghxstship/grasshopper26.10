'use client';

import { useState, useEffect} from 'react';
import { useRouter} from 'next/navigation';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { Badge} from '@/components/atoms/Badge';
import { Input} from '@/components/atoms/Input';
import { Select} from '@/components/atoms/Select';
import { PageTitle, SectionHeader, BodyText, BodyTextSmall, Metadata,
 Caption} from '@/components/atoms/Typography';
import { EmptyState} from '@/components/molecules/EmptyState';
import { Spinner} from '@/components/atoms/Spinner';
import { ShoppingBag, Calendar, MapPin, CreditCard, Search,
 Filter,
 Download,
 Eye,
 Package,
 CheckCircle,
 Clock,
 XCircle,
 AlertCircle
} from 'lucide-react';

interface OrderItem {
 id: string;
 type: string;
 name: string;
 quantity: number;
 price: number;
}

interface Order {
 id: string;
 orderNumber: string;
 status: string;
 subtotal: number;
 tax: number;
 fees: number;
 total: number;
 currency: string;
 createdAt: string;
 event?: {
 id: string;
 name: string;
 slug: string;
 imageUrl?: string;
 startDate: string;
 venue?: {
 name: string;
 city: string;
};
};
 items: OrderItem[];
 tickets?: Array<{
 id: string;
 status: string;
 seatNumber?: string;
}>;
}

const statusConfig = {
 PENDING: { label: 'Pending', variant: 'warning' as const, icon: Clock,
 color: 'text-warning'
},
 CONFIRMED: { label: 'Confirmed', variant: 'info' as const, icon: CheckCircle,
 color: 'text-info'
},
 COMPLETED: { label: 'Completed', variant: 'success' as const, icon: CheckCircle,
 color: 'text-success'
},
 CANCELLED: { label: 'Cancelled', variant: 'error' as const, icon: XCircle,
 color: 'text-error'
},
 REFUNDED: { label: 'Refunded', variant: 'default' as const, icon: AlertCircle,
 color: ''
},
};

export default function OrdersPage() {
 const router = useRouter();
 const [orders, setOrders] = useState<Order[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState('all');
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
 fetchOrders();
}, [page, statusFilter]);

 const fetchOrders = async () => {
 try {
 setLoading(true);
 const params = new URLSearchParams({
 page: page.toString(),
 limit: '10',
});

 if (statusFilter !== 'all') {
 params.append('status', statusFilter);
}

 const response = await fetch(`/api/orders?${params}`);
 if (!response.ok) throw new Error('Failed to fetch orders');

 const data = await response.json();
 setOrders(data.data || []);
 setTotalPages(data.pagination?.totalPages || 1);
} catch (error) {
 console.error('Error fetching orders:', error);
} finally {
 setLoading(false);
}
};

 const handleViewOrder = (orderId: string) => {
 router.push(`/orders/${orderId}`);
};

 const handleDownloadReceipt = async (orderId: string) => {
 // TODO: Implement receipt download
 console.log('Download receipt for order:', orderId);
};

 const filteredOrders = orders.filter(order => order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
 order.event?.name.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const formatCurrency = (amount: number, currency: string = 'USD') => {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency,
}).format(amount);
};

 const formatDate = (dateString: string) => {
 return new Date(dateString).toLocaleDateString('en-US', {
 year: 'numeric',
 month: 'short',
 day: 'numeric',
});
};

 return (
 <GvtewayLayout>
 <ContentLayout
 title="My Orders"
 description="View and manage your order history"
 breadcrumbs={[
 { label: 'Home', href: '/'},
 { label: 'Orders'}
 ]}
 variant="gvteway"
 >
 {/* Search and Filter Bar */}
 <div className="mb-8 flex flex-col sm:flex-row gap-4">
 <div className="flex-1 relative">
 <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
 <Input
 type="text"
 placeholder="Search by order number or event..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="ps-10"
 variant="gvteway"
 />
 </div>
 <div className="flex gap-4">
 <Select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 variant="gvteway"
 className="min-w-[150px]"
 >
 <option value="all">All Status</option>
 <option value="PENDING">Pending</option>
 <option value="CONFIRMED">Confirmed</option>
 <option value="COMPLETED">Completed</option>
 <option value="CANCELLED">Cancelled</option>
 <option value="REFUNDED">Refunded</option>
 </Select>
 </div>
 </div>

 {/* Loading State */}
 {loading && (
 <div className="flex justify-center items-center min-h-[400px]">
 <Spinner variant="gvteway" size="lg" />
 </div>
 )}

 {/* Empty State */}
 {!loading && filteredOrders.length === 0 && (
 <EmptyState
 icon={<ShoppingBag className="h-16 w-16" />}
 title="No Orders Found"
 message={searchQuery || statusFilter !== 'all' ?"No orders match your search criteria. Try adjusting your filters."
 :"You haven't placed any orders yet. Start exploring events!"}
 actionLabel="Browse Events"
 onAction={() => router.push('/events')}
 variant="gvteway"
 />
 )}

 {/* Orders Grid */}
 {!loading && filteredOrders.length > 0 && (
 <div className="space-y-6">
 {filteredOrders.map((order) => {
 const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING;
 const StatusIcon = statusInfo.icon;

 return (
 <Card key={order.id} variant="gvteway" className="hover:shadow-xl transition-shadow">
 <CardHeader>
 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-2">
 <CardTitle className="text-gvteway-red-500">
 {order.orderNumber}
 </CardTitle>
 <Badge variant={statusInfo.variant}>
 <StatusIcon className="h-3 w-3 me-1" />
 {statusInfo.label}
 </Badge>
 </div>
 <CardDescription>
 <div className="flex items-center gap-2">
 <Calendar className="h-4 w-4" />
 <Caption>Ordered on {formatDate(order.createdAt)}</Caption>
 </CardDescription>
 </div>
 <div className="text-right">
 <BodyText className="text-white mb-0">
 {formatCurrency(order.total, order.currency)}
 </BodyText>
 <Caption>
 {order.items.length} item{order.items.length !== 1 ? 's' : ''}
 </Caption>
 </div>
 </CardHeader>

 <CardContent>
 {/* Event Info */}
 {order.event && (
 <div className="flex gap-4 p-4 rounded-lg mb-4">
 {order.event.imageUrl && (
 <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
 <img src={order.event.imageUrl} alt={order.event.name}
 className="w-full h-full object-cover"
 />
 </div>
 )}
 <div className="flex-1 min-w-0">
 <BodyText className="text-white mb-1 truncate">
 {order.event.name}
 </BodyText>
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2">
 <Calendar className="h-3 w-3" />
 <Caption>{formatDate(order.event.startDate)}</Caption>
 {order.event.venue && (
 <div className="flex items-center gap-2">
 <MapPin className="h-3 w-3" />
 <Caption>
 {order.event.venue.name}, {order.event.venue.city}
 </Caption>
 )}
 </div></div>
 )}

 {/* Order Items */}
 <div className="space-y-2">
 {order.items.map((item) => (
 <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0"
 >
 <div className="flex items-center gap-2">
 <Package className="h-4 w-4" />
 <BodyTextSmall className="mb-0">
 {item.name} × {item.quantity}
 </BodyTextSmall>
 </div>
 <Caption>
 {formatCurrency(item.price * item.quantity, order.currency)}
 </Caption>
 ))}
 </div>

 {/* Tickets Info */}
 {order.tickets && order.tickets.length > 0 && (
 <div className="mt-4 p-3 bg-gvteway-red-500/10 border border-gvteway-red-500/20 rounded-lg">
 <div className="flex items-center gap-2">
 <CreditCard className="h-4 w-4 text-gvteway-red-500" />
 <BodyTextSmall className="text-gvteway-red-500 mb-0">
 {order.tickets.length} ticket{order.tickets.length !== 1 ? 's' : ''} generated
 </BodyTextSmall>
 </div>
 </div>
 )}
 </CardContent>

 <CardFooter className="flex flex-col sm:flex-row gap-3">
 <Button
 variant="gvteway"
 onClick={() => handleViewOrder(order.id)}
 className="flex-1 sm:flex-initial"
 leftIcon={<Eye className="h-4 w-4" />}
 >
 View Details
 </Button>
 <Button
 variant="gvteway-outline"
 onClick={() => handleDownloadReceipt(order.id)}
 className="flex-1 sm:flex-initial"
 leftIcon={<Download className="h-4 w-4" />}
 >
 Receipt
 </Button>
 </CardFooter>
 </Card>
 );
})}
 </div>
 )}

 {/* Pagination */}
 {!loading && filteredOrders.length > 0 && totalPages > 1 && (
 <div className="mt-8 flex justify-center gap-2">
 <Button
 variant="gvteway-outline"
 onClick={() => setPage(p => Math.max(1, p - 1))}
 disabled={page === 1}
 >
 Previous
 </Button>
 <div className="flex items-center gap-2 px-4">
 <Caption>
 Page {page} of {totalPages}
 </Caption>
 <Button
 variant="gvteway-outline"
 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
 disabled={page === totalPages}
 >
 Next
 </Button>
 </div>
 )}
 </ContentLayout>
 </GvtewayLayout>
 );
}
