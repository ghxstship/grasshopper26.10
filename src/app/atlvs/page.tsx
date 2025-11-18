'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { Button } from '@/components/atoms/Button';

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
              <Link href="/atlvs/projects">
                <Button variant="atlvs" size="lg" rounded="full" aria-label="Start free trial">
                  START FREE TRIAL
                </Button>
              </Link>
              <Button variant="atlvs-outline" size="lg" rounded="full" aria-label="Watch demo video">
                WATCH DEMO
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </AtlvsLayout>
  );
}
