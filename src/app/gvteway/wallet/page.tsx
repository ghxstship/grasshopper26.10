'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, SectionHeader, CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Wallet, CreditCard, Award, Key, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const _metadata = {
  title: 'Universal Wallet | GVTEWAY',
  description: 'Manage your digital passes, NFTs, credentials, and loyalty points.',
};

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/wallet

export default function WalletPage() {
  return (
    <GvtewayLayout>
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <PageTitle className="mb-4 uppercase text-ghxst-primary">Universal Wallet</PageTitle>
            <BodyText className="text-ghxst-text-secondary">
              Your digital hub for passes, NFTs, credentials, and rewards
            </BodyText>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <WalletCard
              icon={<CreditCard className="w-8 h-8" />}
              title="Digital Passes"
              count="12"
              href="/gvteway/wallet/passes"
            />
            <WalletCard
              icon={<Wallet className="w-8 h-8" />}
              title="NFT Collection"
              count="8"
              href="/gvteway/wallet/nfts"
            />
            <WalletCard
              icon={<Key className="w-8 h-8" />}
              title="Credentials"
              count="5"
              href="/gvteway/wallet/credentials"
            />
            <WalletCard
              icon={<Award className="w-8 h-8" />}
              title="Loyalty Points"
              count="2,450"
              href="/gvteway/wallet/loyalty"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-ghxst-surface rounded-lg">
                  <TrendingUp className="w-6 h-6 text-ghxst-primary" />
                </div>
                <SectionHeader className="text-ghxst-primary">Recent Activity</SectionHeader>
              </div>
              <div className="space-y-4">
                {[
                  { action: 'Ticket added', item: 'Summer Festival 2025', time: '2 hours ago' },
                  { action: 'NFT minted', item: 'VIP Access Pass', time: '1 day ago' },
                  { action: 'Points earned', item: '+150 points', time: '2 days ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-ghxst-border last:border-0">
                    <div>
                      <BodyText className="text-ghxst-text-primary">
                        {activity.action}
                      </BodyText>
                      <Metadata className="text-ghxst-text-secondary">{activity.item}</Metadata>
                    </div>
                    <Metadata className="text-ghxst-text-secondary">{activity.time}</Metadata>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-ghxst-surface">
              <SectionHeader className="mb-4 text-ghxst-primary">Quick Actions</SectionHeader>
              <div className="space-y-3">
                <Link href="/gvteway/wallet/passes">
                  <Button variant="primary" size="md" className="w-full">
                    View All Passes
                  </Button>
                </Link>
                <Link href="/gvteway/auth/connect-wallet">
                  <Button variant="secondary" size="md" className="w-full">
                    Connect Crypto Wallet
                  </Button>
                </Link>
                <Link href="/gvteway/wallet/loyalty">
                  <Button variant="secondary" size="md" className="w-full">
                    Redeem Points
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GvtewayLayout>
  );
}

interface WalletCardProps {
  icon: React.ReactNode;
  title: string;
  count: string;
  href: string;
}

function WalletCard({ icon, title, count, href }: WalletCardProps) {
  return (
    <Link href={href} className="card p-6 hover:border-ghxst-primary transition-colors group">
      <div className="text-ghxst-primary group-hover:text-ghxst-black transition-colors mb-4">
        {icon}
      </div>
      <div className="text-ghxst-primary mb-2">{count}</div>
      <CardTitle className="text-ghxst-text-secondary">{title}</CardTitle>
    </Link>
  );
}
