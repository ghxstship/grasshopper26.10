'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, Mail, User } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { FormField } from '@/components/molecules/FormField';
import { HeroTitle } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/tickets/transfer

export default function TransferTicketPage() {
  const [email, setEmail] = useState('');

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/gvteway/tickets">
                <Button variant="ghost" size="sm" className="mb-6">← Back</Button>
              </Link>

              <HeroTitle className="mb-4 gvteway-text-gradient">TRANSFER TICKET</HeroTitle>

              <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Recipient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <FormField label="Recipient Email">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-500" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="recipient@example.com"
                          variant="gvteway"
                          className="pl-10"
                        />
                      </div>
                    </FormField>

                    <FormField label="Recipient Name">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-500" />
                        <Input placeholder="John Doe" variant="gvteway" className="pl-10" />
                      </div>
                    </FormField>

                    <Button variant="gvteway" size="lg" className="w-full">
                      <Send className="w-5 h-5 mr-2" />
                      Transfer Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
