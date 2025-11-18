'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { motion } from 'framer-motion';
import { FolderKanban, Users, DollarSign, Package, Zap, BarChart3, FileText, Settings, Workflow } from 'lucide-react';

import Link from 'next/link';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

export default function ATLVSPage() {
  return (
    <AtlvsLayout>
    <div className="min-h-screen bg-black text-white -m-6">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden" aria-labelledby="hero-title">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.1),transparent_50%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" aria-hidden="true" />
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-atlvs-green-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-atlvs-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
          aria-hidden="true"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="atlvs-text-gradient mb-6" id="hero-title">
              ATLVS
            </h1>
            <p className="text-3xl sm:text-4xl font-bebas tracking-wide mb-4 text-gray-300">
              PROFESSIONAL EVENT PRODUCTION PLATFORM
            </p>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 font-oswald">
              Manage projects, coordinate teams, track budgets, and automate workflows with enterprise-grade tools built for event professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Primary actions">
              <Button variant="atlvs" size="lg" rounded="full" aria-label="Start free trial">
                START FREE TRIAL
              </Button>
              <Button variant="atlvs-outline" size="lg" rounded="full" aria-label="Watch demo video">
                WATCH DEMO
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl sm:text-6xl font-bebas mb-6" id="features-heading">
              PRODUCTION POWERHOUSE
            </h2>
            <p className="text-xl text-gray-400 font-oswald">
              Six integrated modules plus N8N automation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FolderKanban className="w-8 h-8" />}
              title="Project Management"
              description="Plan, track, and deliver events with powerful project management tools"
              badge="Gantt Charts"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Team Coordination"
              description="Manage crews, assign tasks, track time, and streamline communication"
              badge="Real-time Sync"
            />
            <FeatureCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Budget Tracking"
              description="Monitor expenses, approve purchases, and stay within budget"
              badge="Multi-Currency"
            />
            <FeatureCard
              icon={<Package className="w-8 h-8" />}
              title="Asset Management"
              description="Track equipment, vehicles, and inventory across all events"
              badge="QR Scanning"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Production Advancing"
              description="9-category submission system for technical, hospitality, and logistics"
              badge="Bi-directional"
            />
            <FeatureCard
              icon={<Workflow className="w-8 h-8" />}
              title="N8N Automation"
              description="Visual workflow builder with 400+ integrations and custom nodes"
              badge="Self-hosted"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Document Hub"
              description="Centralize contracts, riders, permits, and production documents"
              badge="Version Control"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Analytics & Reports"
              description="Track KPIs, generate reports, and gain insights across projects"
              badge="Custom Dashboards"
            />
            <FeatureCard
              icon={<Settings className="w-8 h-8" />}
              title="Integrations"
              description="Connect with Stripe, QuickBooks, Slack, and 100+ tools"
              badge="API Access"
            />
          </div>
        </div>
      </section>

      {/* Production Advancing Highlight */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl sm:text-6xl font-bebas mb-6">
              PRODUCTION ADVANCING SYSTEM
            </h2>
            <p className="text-xl text-gray-400 font-oswald">
              Streamline pre-event coordination across 9 critical categories
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Access & Credentials',
              'Site Infrastructure',
              'Site Assets',
              'Site Utilities',
              'Site Vehicles',
              'Heavy Equipment',
              'Technical Production',
              'Hospitality',
              'Travel & Logistics'
            ].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border-2 border-atlvs-green-500/20 hover:border-atlvs-green-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-atlvs-green-500/20 flex items-center justify-center text-atlvs-green-500 font-bebas">
                    {index + 1}
                  </div>
                  <span className="font-oswald text-lg">{category}</span>
                </div>
              </motion.div>
            ))}
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
              READY TO ELEVATE YOUR PRODUCTION?
            </h2>
            <p className="text-xl text-gray-400 mb-12 font-oswald">
              Join industry leaders using ATLVS to deliver world-class events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="atlvs" size="xl" rounded="full">
                START 30-DAY TRIAL
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
    </AtlvsLayout>
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
      <Card variant="atlvs" className="h-full bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-atlvs-green-500/10 rounded-xl text-atlvs-green-500">
              {icon}
            </div>
            <Badge variant="atlvs-outline">{badge}</Badge>
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
