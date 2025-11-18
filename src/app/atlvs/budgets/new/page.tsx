'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { IconButton } from '@/components/atoms/IconButton';
import { useCreateBudget } from '@/lib/hooks/atlvs/useCreateBudget';

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: string;
}

export default function NewBudgetPage() {
  const router = useRouter();
  const { mutate: createBudget, isPending: isLoading, error } = useCreateBudget();
  
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    totalBudget: '',
    currency: 'USD',
    startDate: '',
    endDate: ''
  });

  const [items, setItems] = useState<BudgetItem[]>([
    { id: '1', category: '', description: '', amount: '' }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), category: '', description: '', amount: '' }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBudget({ ...formData, items });
      router.push('/atlvs/budgets');
    } catch (err) {
      console.error('Failed to create budget:', err);
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="CREATE NEW BUDGET"
        description="Set up a budget plan for your project"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Budgets', href: '/atlvs/budgets' },
          { label: 'New Budget' }
        ]}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-destructive/100/10 border border-destructive/30 rounded-lg flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-body-sm">{error.message}</span>
            </div>
          )}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Basic Information</CardTitle>
                <div className="space-y-4">
                  <FormField label="Budget Name" required>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      variant="atlvs"
                      placeholder="Q2 2024 Production Budget"
                    />
                  </FormField>

                  <FormField label="Project" required>
                    <Select
                      required
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      variant="atlvs"
                    >
                      <option value="">Select a project...</option>
                      <option value="1">Summer Music Festival</option>
                      <option value="2">Arena Concert Series</option>
                      <option value="3">Corporate Conference</option>
                    </Select>
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Total Budget" required>
                      <Input
                        type="number"
                        required
                        value={formData.totalBudget}
                        onChange={(e) => setFormData({...formData, totalBudget: e.target.value})}
                        variant="atlvs"
                        placeholder="500000"
                      />
                    </FormField>

                    <FormField label="Currency">
                      <Select
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        variant="atlvs"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Start Date">
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        variant="atlvs"
                      />
                    </FormField>

                    <FormField label="End Date">
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        variant="atlvs"
                      />
                    </FormField>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Budget Items */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-6">
                  <CardTitle>Budget Items</CardTitle>
                  <Button type="button" variant="atlvs" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="font-medium text-gray-400">Item {index + 1}</div>
                        {items.length > 1 && (
                          <IconButton
                            type="button"
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 className="w-4 h-4" />}
                            className="text-error hover:text-destructive"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Category">
                          <Select
                            value={item.category}
                            onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                            variant="atlvs"
                          >
                            <option value="">Select...</option>
                            <option value="venue">Venue</option>
                            <option value="equipment">Equipment</option>
                            <option value="staff">Staff</option>
                            <option value="marketing">Marketing</option>
                            <option value="catering">Catering</option>
                            <option value="other">Other</option>
                          </Select>
                        </FormField>
                        <FormField label="Description">
                          <Input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            variant="atlvs"
                            placeholder="Item description"
                          />
                        </FormField>
                        <FormField label="Amount">
                          <Input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                            variant="atlvs"
                            placeholder="0.00"
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/atlvs/budgets">
                <Button variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="atlvs" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create Budget'}
              </Button>
            </div>
          </div>
        </form>
      </ContentLayout>
    </AtlvsLayout>
  );
}
