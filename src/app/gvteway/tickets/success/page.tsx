'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Calendar, Mail, Smartphone } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';

import { Card, CardContent } from '@/components/atoms/Card';

export default function TicketSuccessPage() {
  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16 flex items-center">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm text-center">
                <CardContent className="p-12">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mb-6"
                  >
                    <div className="w-24 h-24 bg-success-light0/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-16 h-16 text-success" />
                    </div>
                  </motion.div>

                  {/* Success Message */}
                  <h1 className="text-h2 font-bebas text-white mb-4">
                    TICKETS PURCHASED!
                  </h1>
                  <p className="text-h5 text-gray-300 mb-8">
                    Your order has been confirmed
                  </p>

                  {/* Order Details */}
                  <div className="bg-gray-800/50 rounded-xl p-6 mb-8 text-left">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Order Number</span>
                        <span className="text-white font-mono">ORD-2025-001234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Event</span>
                        <span className="text-white">Summer Music Festival 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tickets</span>
                        <span className="text-white">2x VIP Pass</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-700">
                        <span className="text-gray-400">Total Paid</span>
                        <span className="text-h4 font-bebas text-gvteway-red-500">$179.98</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Info */}
                  <div className="mb-8 p-4 bg-gvteway-blue-500/10 border border-gvteway-blue-500/30 rounded-lg">
                    <div className="flex items-start text-left">
                      <Mail className="w-5 h-5 text-gvteway-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-body-sm text-gray-300">
                        <p className="font-medium text-white mb-1">Confirmation Email Sent</p>
                        <p>Check your email for order details and tickets</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/gvteway/tickets">
                      <Button variant="gvteway" size="lg" className="w-full" rounded="full">
                        View My Tickets
                      </Button>
                    </Link>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Button variant="gvteway-outline" size="lg" className="w-full">
                        <Download className="w-5 h-5 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="gvteway-outline" size="lg" className="w-full">
                        <Smartphone className="w-5 h-5 mr-2" />
                        Add to Wallet
                      </Button>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="mt-8 pt-8 border-t border-gray-800 text-left">
                    <h3 className="text-white font-bebas text-h5 mb-4">What&apos;s Next?</h3>
                    <div className="space-y-3 text-body-sm text-gray-300">
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 text-gvteway-red-500 mr-3 mt-1 flex-shrink-0" />
                        <p>Add the event to your calendar and set reminders</p>
                      </div>
                      <div className="flex items-start">
                        <Smartphone className="w-4 h-4 text-gvteway-red-500 mr-3 mt-1 flex-shrink-0" />
                        <p>Download the GVTEWAY app for easy access to your tickets</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-gvteway-red-500 mr-3 mt-1 flex-shrink-0" />
                        <p>Arrive at least 30 minutes early for smooth entry</p>
                      </div>
                    </div>
                  </div>

                  {/* Continue Shopping */}
                  <div className="mt-8">
                    <Link href="/gvteway/events" className="text-gvteway-red-500 hover:text-gvteway-red-400 text-body-sm">
                      ← Continue exploring events
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
