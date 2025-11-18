'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { DollarSign, Upload, Receipt, Calendar, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';

export default function NewExpensePage() {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Expense submitted:', formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Submit Expense"
        description="Report an expense for reimbursement"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'View All Expenses',
            onClick: () => window.location.href = '/compvss/expenses/dashboard',
            variant: 'outline'
          }
        ]}
      >
        <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-compvss-cyan-500" />
                Expense Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the expense information and attach your receipt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Description */}
                <FormField
                  label="Expense Description"
                  required
                >
                  <Input
                    id="description"
                    type="text"
                    placeholder="e.g., Taxi to venue, Equipment rental, Meals"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    variant="compvss"
                    required
                  />
                </FormField>

                {/* Amount and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Amount"
                    required
                  >
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleChange('amount', e.target.value)}
                        className="pl-10"
                        variant="compvss"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Date"
                    required
                  >
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="pl-10"
                        variant="compvss"
                        required
                      />
                    </div>
                  </FormField>
                </div>

                {/* Category and Payment Method */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Category"
                    required
                  >
                    <Select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      variant="compvss"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="transportation">Transportation</option>
                      <option value="meals">Meals & Entertainment</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="equipment">Equipment & Supplies</option>
                      <option value="communication">Communication</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormField>

                  <FormField
                    label="Payment Method"
                    required
                  >
                    <Select
                      id="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => handleChange('paymentMethod', e.target.value)}
                      variant="compvss"
                      required
                    >
                      <option value="">Select method</option>
                      <option value="personal-card">Personal Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="company-card">Company Card</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormField>
                </div>

                {/* Notes */}
                <FormField
                  label="Additional Notes"
                >
                  <Textarea
                    id="notes"
                    rows={4}
                    placeholder="Any additional context or details about this expense..."
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    variant="compvss"
                  />
                </FormField>

                {/* Receipt Upload */}
                <FormField label="Receipt Image" required>
                  <div className="border-2 border-dashed border-compvss-cyan-500/30 rounded-lg p-8 text-center hover:border-compvss-cyan-500/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-compvss-cyan-500/10 rounded-full">
                        <Receipt className="w-8 h-8 text-compvss-cyan-500" />
                      </div>
                      <div>
                        <p className="text-white font-oswald mb-1">
                          Upload receipt image
                        </p>
                        <p className="text-body-sm text-gray-400 font-share-tech">
                          PNG, JPG, PDF up to 5MB
                        </p>
                      </div>
                      <Button variant="compvss-outline" size="sm" type="button">
                        <Upload className="w-4 h-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  <p className="text-caption text-gray-500 font-share-tech">
                    Clear, readable receipt required for reimbursement
                  </p>
                </FormField>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="compvss"
                    size="lg"
                    className="flex-1"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Expense
                  </Button>
                  <Link href="/compvss/expenses/dashboard" className="flex-1">
                    <Button
                      type="button"
                      variant="compvss-outline"
                      size="lg"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
