'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Tag, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useExpenseCategories } from '@/lib/hooks/compvss/useExpenses';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/expenses/categories

export default function ExpenseCategoriesPage() {
  const { data: categories = [], isLoading, error, refetch } = useExpenseCategories();

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Expense Categories"
          description="Track spending by category"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading categories...</BodyText>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Expense Categories"
          description="Track spending by category"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Categories</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
              <Button variant="compvss" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Expense Categories"
        description="Track spending by category"
        variant="compvss"
        showToolbar={false}
        
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50 hover:bg-grey-900/70 transition-all">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white mb-4`}>
                    <Tag className="w-8 h-8" />
                  </div>
                  <h3 className="text-white mb-2">{category.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-compvss-cyan-500">{category.total}</div>
                    <Badge variant="compvss-outline" className="text-caption">
                      {category.count} expenses
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-caption text-success -tech">
                    <TrendingUp className="w-3 h-3" />
                    <span>Within budget</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
