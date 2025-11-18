'use client';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function COMPVSSPage() {
  return (
    <CompvssLayout>
    <div className="min-h-screen bg-black text-white -m-6">
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
            <p className="text-h3 font-bebas mb-4 text-gray-300">
              EXTERNAL TEAMS & DAY-OF-SHOW OPERATIONS
            </p>
            <p className="text-h5 text-gray-400 max-w-3xl mx-auto mb-12 font-oswald">
              Onboard production crews, manage affiliates, submit advancing requests, and coordinate day-of-show operations—all in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/compvss/dashboard">
                <Button variant="compvss" size="lg" rounded="full">
                  GET STARTED
                </Button>
              </Link>
              <Button variant="compvss-outline" size="lg" rounded="full">
                VIEW FEATURES
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </CompvssLayout>
  );
}
