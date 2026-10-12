import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from 'lucide-react';

import {
  getSpendingByCategory,
  getMonthlyIncomeExpense,
  getSpendingTrend,
} from '../api/insight.api';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';
import { getCurrentMonth, parseMonthStr } from '../utils/dates';

import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import SpendingPie from '../components/charts/SpendingPie';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar';
import TrendLine from '../components/charts/TrendLine';

/* ─── Top Categories Table ───────────────────────────────────────── */
function TopCategories({ data, currency }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 text-sm py-6">No spending data yet</p>;
  }
  const max = data[0]?.total || 1;

  return (
    <div className="space-y-3">
      {data.slice(0, 6).map((cat, idx) => (
        <div key={cat.category} className="flex items-center gap-3">
          <span className="w-5 h-5 text-center text-sm font-bold text-gray-400">{idx + 1}</span>
          <span className="text-lg">{cat.emoji || '📂'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{cat.category}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white ml-2 shrink-0">
                {formatCurrency(cat.total, currency)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(cat.total / max) * 100}%`, backgroundColor: cat.color || '#10b981' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Month Comparison ───────────────────────────────────────────── */
function MonthComparison({ data }) {
  if (!data || data.length < 2) return null;
  const current = data[data.length - 1];
  const previous = data[data.length - 2];

  const incomeChange = previous?.income > 0
    ? ((current.income - previous.income) / previous.income * 100).toFixed(1)
    : null;
  const expenseChange = previous?.expense > 0
    ? ((current.expense - previous.expense) / previous.expense * 100).toFixed(1)
    : null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
        <p className="text-xs text-gray-500">Income vs last month</p>
        <p className={`text-lg font-bold mt-1 ${incomeChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {incomeChange !== null ? `${incomeChange > 0 ? '+' : ''}${incomeChange}%` : 'N/A'}
        </p>
      </div>
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
        <p className="text-xs text-gray-500">Spending vs last month</p>
        <p className={`text-lg font-bold mt-1 ${expenseChange <= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {expenseChange !== null ? `${expenseChange > 0 ? '+' : ''}${expenseChange}%` : 'N/A'}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
const Insights = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [monthsRange, setMonthsRange] = useState(6);

  const { data: pieData, isLoading: pieLoading } = useQuery({
    queryKey: ['spendingByCategory', selectedMonth],
    queryFn: () => getSpendingByCategory(selectedMonth),
  });

  const { data: barData, isLoading: barLoading } = useQuery({
    queryKey: ['monthlyIncomeExpense', monthsRange],
    queryFn: () => getMonthlyIncomeExpense(monthsRange),
  });

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['spendingTrend'],
    queryFn: getSpendingTrend,
  });

  const categories = Array.isArray(pieData) ? pieData : (pieData?.data || []);
  const monthly = Array.isArray(barData) ? barData : (barData?.data || []);
  const trend = Array.isArray(trendData) ? trendData : (trendData?.data || []);

  const totalSpending = categories.reduce((s, c) => s + c.total, 0);
  const currentMonthData = monthly[monthly.length - 1] || {};

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
          <p className="text-sm text-gray-500 mt-0.5">Understand your spending patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <select
            value={monthsRange}
            onChange={e => setMonthsRange(Number(e.target.value))}
            className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </select>
        </div>
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Spending', value: formatCurrency(totalSpending, currency), icon: ShoppingBag, color: 'text-red-500' },
          { label: 'Categories', value: categories.length, icon: DollarSign, color: 'text-blue-600' },
          { label: 'This Month Income', value: formatCurrency(currentMonthData.income || 0, currency), icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'This Month Expense', value: formatCurrency(currentMonthData.expense || 0, currency), icon: TrendingDown, color: 'text-red-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={<h2 className="text-base font-semibold text-gray-900 dark:text-white">Spending by Category — {parseMonthStr(selectedMonth)}</h2>}>
          {pieLoading ? (
            <Skeleton className="h-72 w-full rounded-xl" />
          ) : (
            <SpendingPie data={categories} currency={currency} />
          )}
        </Card>

        <Card header={<h2 className="text-base font-semibold text-gray-900 dark:text-white">Top Categories</h2>}>
          {pieLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
            </div>
          ) : (
            <TopCategories data={categories} currency={currency} />
          )}
        </Card>
      </div>

      {/* Income vs Expense Bar */}
      <Card header={
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Income vs Expenses — Last {monthsRange} Months</h2>
        </div>
      }>
        {barLoading ? (
          <Skeleton className="h-72 w-full rounded-xl" />
        ) : (
          <>
            <IncomeExpenseBar data={monthly} currency={currency} />
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Month-over-Month Change</h3>
              <MonthComparison data={monthly} />
            </div>
          </>
        )}
      </Card>

      {/* Spending Trend */}
      <Card header={<h2 className="text-base font-semibold text-gray-900 dark:text-white">Daily Spending Trend — Last 30 Days</h2>}>
        {trendLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <TrendLine data={trend} currency={currency} />
        )}
      </Card>
    </motion.div>
  );
};

export default Insights;
