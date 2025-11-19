'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { BodyText, HeroTitle } from "@/components/atoms/Typography";


// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/wallet/google-wallet

export default function GoogleWalletPage() {
  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card variant="gvteway" className="bg-grey-900/50 text-center">
                <CardContent className="p-12">
                  <Smartphone className="w-24 h-24 text-gvteway-blue-500 mx-auto mb-6" />
                  <HeroTitle className="text-white mb-4">GOOGLE WALLET</HeroTitle>
                  <BodyText className="text-grey-300 mb-8">Add your tickets to Google Wallet for easy access</BodyText>
                  <Button variant="gvteway" size="lg">Add to Google Wallet</Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
