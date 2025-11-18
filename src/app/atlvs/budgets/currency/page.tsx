'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { DollarSign, TrendingUp, RefreshCw, Settings, ArrowLeftRight, ChevronUp, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { useBudgets } from '@/lib/hooks/atlvs/useBudgets';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

export default function MultiCurrencyPage() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [showConverter, setShowConverter] = useState(false);
  const [convertAmount, setConvertAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const { data, isLoading, error, refetch } = useBudgets({ type: 'currency' });
  const currencies = (data as any)?.currencies || [];
  const budgetItems = (data as any)?.items || [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="MULTI-CURRENCY"
          description="Loading..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Currency' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="MULTI-CURRENCY"
          description="Error loading data"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Currency' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const convertCurrency = (amount: number, from: string, to: string) => {
    const fromRate = currencies.find((c: Currency) => c.code === from)?.rate || 1;
    const toRate = currencies.find((c: Currency) => c.code === to)?.rate || 1;
    return (amount / fromRate) * toRate;
  };

  const getTotalInBaseCurrency = () => {
    return budgetItems.reduce((total: number, item: BudgetItem) => {
      return total + convertCurrency(item.amount, item.currency, baseCurrency);
    }, 0);
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find((c: Currency) => c.code === code)?.symbol || '$';
  };

  const convertedAmount = convertAmount ? 
    convertCurrency(parseFloat(convertAmount), fromCurrency, toCurrency) : 0;

  return (
    <AtlvsLayout>
      <ContentLayout
        title="MULTI-CURRENCY MANAGEMENT"
        description="Manage budgets across multiple currencies"
        breadcrumbs={[
          { label: 'Budgets', href: '/atlvs/budgets' },
          { label: 'Currency' }
        ]}
      >
        <div className="space-y-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Base Currency</CardTitle>
                  <CardDescription className="text-gray-400">All amounts will be converted to this currency</CardDescription>
                </div>
              <Select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                variant="atlvs"
              >
                {currencies.map((currency: Currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </Select>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Current Exchange Rates</CardTitle>
                <Button variant="atlvs-outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Rates
              </Button>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currencies.filter((c: any) => c.code !== baseCurrency).map((currency: any) => (
                  <div key={currency.code} className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{currency.code}</span>
                      <TrendingUp className="w-4 h-4 text-atlvs-green-500" />
                    </div>
                    <div className="text-h4 text-white mb-1">
                      {currency.symbol}{currency.rate.toFixed(4)}
                    </div>
                    <div className="text-body-sm text-gray-400">per {baseCurrency}</div>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Currency Converter</CardTitle>
              <Button
                onClick={() => setShowConverter(!showConverter)}
                variant="ghost"
                size="sm"
              >
                {showConverter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            
            {showConverter && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <FormField label="Amount">
                    <Input
                      type="number"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      placeholder="Enter amount"
                      variant="atlvs"
                    />
                  </FormField>
                  <FormField label="From">
                    <Select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      variant="atlvs"
                    >
                      {currencies.map((currency: Currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="To">
                    <Select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      variant="atlvs"
                    >
                      {currencies.map((currency: Currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                </div>
                
                {convertAmount && (
                  <div className="p-4 bg-atlvs-green-500/10 border border-atlvs-green-500/30 rounded-lg">
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-center">
                        <div className="text-body-sm text-gray-400 mb-1">From</div>
                        <div className="text-h4 text-white">
                          {getCurrencySymbol(fromCurrency)}{parseFloat(convertAmount).toLocaleString()}
                        </div>
                        <div className="text-body-sm text-gray-400">{fromCurrency}</div>
                      </div>
                      <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                      <div className="text-center">
                        <div className="text-body-sm text-gray-400 mb-1">To</div>
                        <div className="text-h4 text-atlvs-green-500">
                          {getCurrencySymbol(toCurrency)}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-body-sm text-gray-400">{toCurrency}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            </CardHeader>
          </Card>
        </div>

      {/* Budget Items by Currency */}
      <Card variant="atlvs" className="bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle className="mb-4">Budget Items</CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-body-sm text-gray-400">Item</th>
                  <th className="px-4 py-3 text-right text-body-sm text-gray-400">Original Amount</th>
                  <th className="px-4 py-3 text-right text-body-sm text-gray-400">Currency</th>
                  <th className="px-4 py-3 text-right text-body-sm text-gray-400">
                  In {baseCurrency}
                </th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-800">
                {budgetItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-body-sm text-white">{item.name}</td>
                    <td className="px-4 py-3 text-body-sm text-right text-white">
                      {getCurrencySymbol(item.currency)}{item.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-right">
                      <Badge variant="atlvs-outline" className="text-caption">
                        {item.currency}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-right text-white">
                    {getCurrencySymbol(baseCurrency)}
                    {convertCurrency(item.amount, item.currency, baseCurrency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
              <tfoot className="bg-gray-800/50 border-t-2 border-gray-700">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-body-sm text-white">
                    Total (in {baseCurrency})
                  </td>
                  <td className="px-4 py-3 text-body-sm text-right text-atlvs-green-500">
                  {getCurrencySymbol(baseCurrency)}
                  {getTotalInBaseCurrency().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
            </table>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-atlvs-green-500" />
              <div>
                <CardDescription className="text-gray-400">Base Currency</CardDescription>
                <CardTitle className="text-h5 font-bebas">{baseCurrency}</CardTitle>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-info" />
              <div>
                <CardDescription className="text-gray-400">Currencies Used</CardDescription>
                <CardTitle className="text-h5 font-bebas">
                  {new Set(budgetItems.map((i: any) => i.currency)).size}
                </CardTitle>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-atlvs-purple-500" />
              <div>
                <CardDescription className="text-gray-400">Budget Items</CardDescription>
                <CardTitle className="text-h5 font-bebas">{budgetItems.length}</CardTitle>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-gray-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-8 h-8 text-atlvs-orange-500" />
              <div>
                <CardDescription className="text-gray-400">Total Value</CardDescription>
                <CardTitle className="text-h5 font-bebas">
                  {getCurrencySymbol(baseCurrency)}
                  {(getTotalInBaseCurrency() / 1000).toFixed(0)}K
                </CardTitle>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
