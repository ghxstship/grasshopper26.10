'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { ClipboardCheck, ArrowRight } from 'lucide-react';
import { useAdvancing } from '@/lib/hooks/compvss/useAdvancing';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { ADVANCING_CATEGORIES } from '@/lib/constants/categories';
import { ADVANCING_CATEGORY_ICONS } from '@/lib/constants/advancing-icons';
import { BodyText, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/advancing/new

export default function NewAdvancingRequestPage() {
  const {  } = useAdvancing();
  
  // Map categories with icons
  const categories = ADVANCING_CATEGORIES.map(cat => {
    const IconComponent = ADVANCING_CATEGORY_ICONS[cat.id];
    return {
      ...cat,
      icon: <IconComponent className="w-8 h-8" />,
    };
  });

  return (
    <CompvssLayout>
      <ContentLayout
        title="New Advancing Request"
        description="Select a category to begin your request"
        
        variant="compvss"
        showToolbar={false}
      >
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card variant="compvss" className="bg-grey-900/50 border-compvss-cyan-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-compvss-cyan-500/10 rounded-xl">
                  <ClipboardCheck className="w-6 h-6 text-compvss-cyan-500" />
                </div>
                <div>
                  <SubsectionHeader className="text-white mb-2">About Production Advancing</SubsectionHeader>
                  <BodyText className="text-grey-400 -tech text-body-sm mb-3">
                    Production advancing allows external teams to submit requests for resources, equipment, and services needed for events. 
                    Your requests will be reviewed and approved by the internal ATLVS team.
                  </BodyText>
                  <ul className="space-y-1 text-body-sm text-grey-400 -tech">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full" />
                      Select the appropriate category for your request
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full" />
                      Provide detailed specifications and quantities
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full" />
                      Attach relevant documents or diagrams
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full" />
                      Track your request status in real-time
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionHeader className="text-white mb-6">Select Request Category</SectionHeader>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={`/compvss/advancing/category/${category.id}`}>
                  <Card 
                    variant="compvss" 
                    className="bg-grey-900/50 hover:bg-grey-900/70 transition-all cursor-pointer h-full"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-compvss-cyan-500/10 rounded-xl text-compvss-cyan-500">
                          {category.icon}
                        </div>
                        <ArrowRight className="w-5 h-5 text-grey-500 group-hover:text-compvss-cyan-500 transition-colors" />
                      </div>
                      <CardTitle className="text-white mb-2">{category.name}</CardTitle>
                      <CardDescription className="text-grey-400 mb-3">
                        {category.description}
                      </CardDescription>
                      <div className="pt-3 border-t border-grey-800">
                        <p className="text-caption text-grey-500 -tech">
                          Examples: {category.examples}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
