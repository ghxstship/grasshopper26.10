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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Base Currency</h2>
                <p className="text-sm text-gray-600">All amounts will be converted to this currency</p>
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
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Exchange Rates</h2>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Rates
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currencies.filter((c: any) => c.code !== baseCurrency).map((currency: any) => (
                <div key={currency.code} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{currency.code}</span>
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {currency.symbol}{currency.rate.toFixed(4)}
                  </div>
                  <div className="text-sm text-gray-600">per {baseCurrency}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Currency Converter</h2>
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
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">From</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {getCurrencySymbol(fromCurrency)}{parseFloat(convertAmount).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">{fromCurrency}</div>
                      </div>
                      <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">To</div>
                        <div className="text-2xl font-bold text-success">
                          {getCurrencySymbol(toCurrency)}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-gray-600">{toCurrency}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      {/* Budget Items by Currency */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Original Amount</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Currency</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  In {baseCurrency}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {budgetItems.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {getCurrencySymbol(item.currency)}{item.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {item.currency}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    {getCurrencySymbol(baseCurrency)}
                    {convertCurrency(item.amount, item.currency, baseCurrency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900">
                  Total (in {baseCurrency})
                </td>
                <td className="px-4 py-3 text-sm text-right font-bold text-success">
                  {getCurrencySymbol(baseCurrency)}
                  {getTotalInBaseCurrency().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-success" />
            <div>
              <div className="text-sm text-gray-600">Base Currency</div>
              <div className="text-xl font-bold text-gray-900">{baseCurrency}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-info" />
            <div>
              <div className="text-sm text-gray-600">Currencies Used</div>
              <div className="text-xl font-bold text-gray-900">
                {new Set(budgetItems.map((i: any) => i.currency)).size}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-atlvs-purple-500" />
            <div>
              <div className="text-sm text-gray-600">Budget Items</div>
              <div className="text-xl font-bold text-gray-900">{budgetItems.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-atlvs-orange-500" />
            <div>
              <div className="text-sm text-gray-600">Total Value</div>
              <div className="text-xl font-bold text-gray-900">
                {getCurrencySymbol(baseCurrency)}
                {(getTotalInBaseCurrency() / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
