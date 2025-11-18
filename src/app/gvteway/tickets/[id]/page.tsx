'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { QrCode, Download, Send, DollarSign, Calendar, MapPin, User, Ticket, ChevronLeft, Smartphone,  } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useTickets } from '@/lib/hooks/gvteway/useTickets';

interface ExtendedTicket {
  id: string;
  eventName?: string;
  date?: string;
  time?: string;
  venue?: string;
  location?: string;
  ticketType?: string;
  section?: string;
  row?: string;
  seat?: string;
  quantity?: number;
  orderNumber?: string;
  purchaseDate?: string;
  price?: number;
  transferable?: boolean;
  resellable?: boolean;
  status?: string;
  qrCode?: string;
  [key: string]: any; // Allow additional properties from Prisma model
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {  
  const [showQR, setShowQR] = useState(false);
  const { data,  } = useTickets();
  const tickets = data?.tickets;
  
  const ticket: ExtendedTicket = (tickets?.find((t: any) => t.id === params.id) as ExtendedTicket) || {
    id: params.id,
    eventName: 'Summer Music Festival 2025',
    date: '2025-07-15',
    time: '6:00 PM',
    venue: 'Central Park',
    location: 'New York, NY',
    ticketType: 'VIP Pass',
    section: 'VIP Area',
    row: 'A',
    seat: '15-16',
    quantity: 2,
    price: 89.99,
    orderNumber: 'ORD-2025-001234',
    purchaseDate: '2025-06-01',
    status: 'active',
    qrCode: 'QR123456',
    transferable: true,
    resellable: true,
  };

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Back Button */}
              <Link href="/gvteway/tickets">
                <Button variant="ghost" size="sm" className="mb-6 text-gray-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Tickets
                </Button>
              </Link>

              {/* Ticket Card */}
              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm mb-6">
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-h2 font-bebas text-white mb-2">
                        {ticket.eventName}
                      </h1>
                      <Badge variant="gvteway">{ticket.ticketType}</Badge>
                    </div>
                    <Badge variant="gvteway-outline">Active</Badge>
                  </div>

                  {/* QR Code Section */}
                  <div className="bg-white rounded-xl p-8 mb-6 text-center">
                    {showQR ? (
                      <div>
                        <div className="w-64 h-64 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                          <QrCode className="w-32 h-32 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-body-sm mb-2">Scan at venue entrance</p>
                        <p className="text-gray-800 font-mono text-caption">{ticket.qrCode}</p>
                      </div>
                    ) : (
                      <div className="py-12">
                        <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <Button 
                          variant="default" 
                          size="lg" 
                          onClick={() => setShowQR(true)}
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Show QR Code
                        </Button>
                        <p className="text-gray-600 text-body-sm mt-4">
                          Only show this at the venue entrance
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gvteway-red-500 mr-3 mt-1" />
                        <div>
                          <p className="text-gray-400 text-body-sm">Date & Time</p>
                          <p className="text-white">{ticket.date}</p>
                          <p className="text-gray-300">{ticket.time}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gvteway-red-500 mr-3 mt-1" />
                        <div>
                          <p className="text-gray-400 text-body-sm">Venue</p>
                          <p className="text-white">{ticket.venue}</p>
                          <p className="text-gray-300">{ticket.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Ticket className="w-5 h-5 text-gvteway-red-500 mr-3 mt-1" />
                        <div>
                          <p className="text-gray-400 text-body-sm">Seating</p>
                          <p className="text-white">Section {ticket.section}</p>
                          <p className="text-gray-300">Row {ticket.row}, Seats {ticket.seat}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gvteway-red-500 mr-3 mt-1" />
                        <div>
                          <p className="text-gray-400 text-body-sm">Quantity</p>
                          <p className="text-white">{ticket.quantity} Tickets</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="pt-6 border-t border-gray-800">
                    <div className="grid sm:grid-cols-2 gap-4 text-body-sm">
                      <div>
                        <p className="text-gray-400">Order Number</p>
                        <p className="text-white font-mono">{ticket.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Purchase Date</p>
                        <p className="text-white">{ticket.purchaseDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Total Paid</p>
                        <p className="text-white">${(ticket.price * ticket.quantity).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Price per Ticket</p>
                        <p className="text-white">${ticket.price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Button variant="gvteway" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="gvteway-outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Add to Wallet
                </Button>
                {ticket.transferable && (
                  <Link href={`/gvteway/tickets/${ticket.id}/transfer`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Transfer
                    </Button>
                  </Link>
                )}
                {ticket.resellable && (
                  <Link href={`/gvteway/tickets/${ticket.id}/sell`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Resell
                    </Button>
                  </Link>
                )}
              </div>

              {/* Additional Info */}
              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Important Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-300 text-body-sm">
                    <li className="flex items-start">
                      <span className="text-gvteway-red-500 mr-2">•</span>
                      <span>Please arrive at least 30 minutes before the event starts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gvteway-red-500 mr-2">•</span>
                      <span>Valid ID required for entry (must match ticket holder name)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gvteway-red-500 mr-2">•</span>
                      <span>Screenshots of QR codes will not be accepted</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gvteway-red-500 mr-2">•</span>
                      <span>Tickets are non-refundable but may be transferred or resold</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
