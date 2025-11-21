'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Badge } from '@/components/atoms/Badge';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/marketplace/orders

export default function OrdersPage() {
  const orders = [{ id: '1', title: 'Order #1234', date: 'Nov 18, 2025', status: 'Delivered', total: 75 }];
  return (
    <ListPageTemplate title="My Orders" description="Track your marketplace orders">
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-6 flex items-center justify-between">
            <div>
              <CardTitle className="mb-2 text-ghxst-primary">{order.title}</CardTitle>
              <Metadata className="text-ghxst-text-secondary">{order.date}</Metadata>
            </div>
            <div className="text-right">
              <Badge variant="success" className="mb-2">{order.status}</Badge>
              <CardTitle className="text-ghxst-primary">${order.total}</CardTitle>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
