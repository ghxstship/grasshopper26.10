'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { motion } from 'framer-motion';
import { UserCheck, ClipboardCheck, QrCode, AlertCircle, DollarSign, BarChart2, Users2, Shield, Camera, Megaphone, Handshake, Building2, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

export default function COMPVSSPage() {
  return (
    <CompvssLayout>
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-compvss-cyan-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-compvss-indigo-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="compvss-text-gradient mb-6">
              COMPVSS
            </h1>
            <p className="text-3xl sm:text-4xl font-bebas tracking-wide mb-4 text-gray-300">
              EXTERNAL TEAMS & DAY-OF-SHOW OPERATIONS
            </p>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 font-oswald">
              Onboard production crews, manage affiliates, submit advancing requests, and coordinate day-of-show operations—all in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="compvss" size="lg" rounded="full">
                GET STARTED
              </Button>
              <Button variant="compvss-outline" size="lg" rounded="full">
                VIEW FEATURES
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl sm:text-6xl font-bebas mb-6">
              WHO USES COMPVSS?
            </h2>
            <p className="text-xl text-gray-400 font-oswald">
              Built for external teams and collaborators
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users2 className="w-6 h-6" />, label: 'Production Crews' },
              { icon: <UserCheck className="w-6 h-6" />, label: 'Event Staff' },
              { icon: <Camera className="w-6 h-6" />, label: 'Media & Press' },
              { icon: <Megaphone className="w-6 h-6" />, label: 'Sponsors' },
              { icon: <Handshake className="w-6 h-6" />, label: 'Partners' },
              { icon: <Users2 className="w-6 h-6" />, label: 'Brand Ambassadors' },
              { icon: <BarChart2 className="w-6 h-6" />, label: 'Affiliates' },
              { icon: <Building2 className="w-6 h-6" />, label: 'Government Agencies' },
            ].map((type, index) => (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border-2 border-compvss-cyan-500/20 hover:border-compvss-cyan-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500">
                    {type.icon}
                  </div>
                  <span className="font-oswald text-base">{type.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl sm:text-6xl font-bebas mb-6">
              COMPREHENSIVE FEATURES
            </h2>
            <p className="text-xl text-gray-400 font-oswald">
              Everything external teams need to succeed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<UserCheck className="w-8 h-8" />}
              title="Team Onboarding"
              description="Streamlined onboarding for production crews, staff, media, and partners"
              badge="Fast Setup"
            />
            <FeatureCard
              icon={<ClipboardCheck className="w-8 h-8" />}
              title="Production Advancing"
              description="Submit and track advancing requests across all 9 categories"
              badge="9 Categories"
            />
            <FeatureCard
              icon={<QrCode className="w-8 h-8" />}
              title="QR Code Management"
              description="Generate, scan, and manage QR codes for access and tracking"
              badge="Real-time"
            />
            <FeatureCard
              icon={<BarChart2 className="w-8 h-8" />}
              title="Day-of-Show Dashboard"
              description="Live operations dashboard with real-time updates and metrics"
              badge="Live Updates"
            />
            <FeatureCard
              icon={<AlertCircle className="w-8 h-8" />}
              title="Issue Reporting"
              description="Report and track issues with priority levels and assignments"
              badge="Priority System"
            />
            <FeatureCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Expense Reports"
              description="Submit expenses, attach receipts, and track reimbursements"
              badge="Receipt Scanning"
            />
            <FeatureCard
              icon={<Handshake className="w-8 h-8" />}
              title="Affiliate Management"
              description="Track affiliate activities, commissions, and performance"
              badge="Commission Tracking"
            />
            <FeatureCard
              icon={<Users2 className="w-8 h-8" />}
              title="Referral System"
              description="Manage referrals, track conversions, and earn rewards"
              badge="Rewards Program"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Credential Verification"
              description="Verify credentials, certifications, and access permissions"
              badge="Secure"
            />
          </div>
        </div>
      </section>

      {/* Production Advancing Highlight */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl sm:text-6xl font-bebas mb-6">
              PRODUCTION ADVANCING
            </h2>
            <p className="text-xl text-gray-400 font-oswald mb-4">
              Submit requests across 9 critical categories
            </p>
            <p className="text-base text-gray-500 font-share-tech max-w-2xl mx-auto">
              External teams submit advancing requests through COMPVSS, which are reviewed and approved by internal teams in ATLVS
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <FileCheck />, title: 'Access & Credentials', desc: 'Passes, badges, parking' },
              { icon: <Building2 />, title: 'Site Infrastructure', desc: 'Stages, barriers, signage' },
              { icon: <Users2 />, title: 'Site Assets', desc: 'Tables, chairs, tents' },
              { icon: <Shield />, title: 'Site Utilities', desc: 'Power, water, internet' },
              { icon: <Users2 />, title: 'Site Vehicles', desc: 'Carts, forklifts, trucks' },
              { icon: <Users2 />, title: 'Heavy Equipment', desc: 'Cranes, lifts, generators' },
              { icon: <Camera />, title: 'Technical Production', desc: 'Audio, video, lighting' },
              { icon: <Users2 />, title: 'Hospitality', desc: 'Catering, green rooms' },
              { icon: <Users2 />, title: 'Travel & Logistics', desc: 'Transport, accommodation' },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="compvss" className="h-full bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-compvss-cyan-500/10 rounded-xl text-compvss-cyan-500">
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg mb-2">{category.title}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {category.desc}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Day-of-Show Operations */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl sm:text-6xl font-bebas mb-6">
              DAY-OF-SHOW OPERATIONS
            </h2>
            <p className="text-xl text-gray-400 font-oswald">
              Real-time coordination when it matters most
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bebas text-compvss-cyan-500">LIVE DASHBOARDS</h3>
              <ul className="space-y-4 font-share-tech text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-compvss-cyan-500 rounded-full mt-2" />
                  <span>Real-time event status and updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-compvss-cyan-500 rounded-full mt-2" />
                  <span>Team locations and check-ins</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-compvss-cyan-500 rounded-full mt-2" />
                  <span>Task completion tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-compvss-cyan-500 rounded-full mt-2" />
                  <span>Issue alerts and notifications</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bebas text-compvss-teal-500">QR CODE SCANNING</h3>
              <ul className="space-y-4 font-share-tech text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-compvss-teal-500 rounded-full mt-2" />
                  <span>Access control and verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-compvss-teal-500 rounded-full mt-2" />
                  <span>Equipment check-in/check-out</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-compvss-teal-500 rounded-full mt-2" />
                  <span>Meal voucher redemption</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-compvss-teal-500 rounded-full mt-2" />
                  <span>Attendance tracking</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl sm:text-6xl font-bebas mb-6">
              READY TO JOIN THE TEAM?
            </h2>
            <p className="text-xl text-gray-400 mb-12 font-oswald">
              Get onboarded and start collaborating with event organizers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="compvss" size="xl" rounded="full">
                REQUEST ACCESS
              </Button>
              <Link href="/">
                <Button variant="ghost" size="xl" rounded="full" className="text-white">
                  BACK TO HOME
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </CompvssLayout>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  badge 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  badge: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="compvss" className="h-full bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-compvss-cyan-500/10 rounded-xl text-compvss-cyan-500">
              {icon}
            </div>
            <Badge variant="compvss-outline">{badge}</Badge>
          </div>
          <CardTitle className="text-white">{title}</CardTitle>
          <CardDescription className="text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
