import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

import { getBudgets, createBudget, deleteBudget } from '../api/budget.api';
import { getCategories } from '../api/category.api';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';
import { getCurrentMonth, parseMonthStr } from '../utils/dates';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ProgressBar from '../components/ui/ProgressBar';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';

/* ─── Zod schema ─────────────────────────────────────────────────── */
const budgetSchema = z.object({
  category: z.string().min(1, 'Select a category'),
  amount: z.coerce.number().positive('Limit must be positive'),
  month: z.string().min(1, 'Month is required'),
});

/* ─── Budget Item ────────────────────────────────────────────────── */
function BudgetItem({ budget, currency, onDelete }) {
  const spent = budget.spent || 0;
  const limit = budget.amount;
  const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const isOver = pct >= 100;
  const isWarning = pct >= 80 && !isOver;

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{budget.category?.emoji || '📂'}</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{budget.category?.name}</p>
            <p className="text-xs text-gray-500">
              {formatCurrency(spent, currency)} of {formatCurrency(limit, currency)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOver && (
            <Badge variant="danger" className="flex items-center gap-1 text-xs">
              <AlertTriangle size={10} /> Over Budget
            </Badge>
          )}
          {isWarning && (
            <Badge variant="warning" className="text-xs">Near Limit</Badge>
          )}
          <span className={`text-sm font-semibold ${isOver ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-gray-600 dark:text-gray-300'}`}>
            {pct}%
          </span>
          <button onClick={() => onDelete(budget)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <ProgressBar value={pct} />
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
const Budgets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currency = user?.currency || 'USD';

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [addOpen, setAddOpen] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['budgets', selectedMonth],
    queryFn: () => getBudgets(selectedMonth),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const budgets = data?.data || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);
  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: { month: selectedMonth },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createBudget({ ...data, amount: Math.round(data.amount * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget created!');
      reset({ month: selectedMonth });
      setAddOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to create budget'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget removed');
      setDeletingBudget(null);
    },
    onError: () => toast.error('Failed to delete budget'),
  });

  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.amount, 0);
  const overBudget = budgets.filter(b => (b.spent || 0) >= b.amount);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monthly spending limits by category</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Budget</Button>
        </div>
      </div>

      {/* Summary cards */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Budgeted</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalLimit, currency)}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Spent</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(totalSpent, currency)}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Remaining</p>
            <p className={`text-2xl font-bold mt-1 ${totalLimit - totalSpent >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {formatCurrency(totalLimit - totalSpent, currency)}
            </p>
          </Card>
        </div>
      )}

      {/* Warnings */}
      {overBudget.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              {overBudget.length} budget{overBudget.length > 1 ? 's' : ''} exceeded
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              {overBudget.map(b => b.category?.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Budget list */}
      <Card>
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : budgets.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No budgets for {parseMonthStr(selectedMonth)}</h3>
            <p className="text-gray-500 text-sm mb-6">Set monthly limits to keep your spending on track</p>
            <Button icon={Plus} onClick={() => setAddOpen(true)}>Add First Budget</Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {budgets.map(budget => (
              <BudgetItem
                key={budget._id}
                budget={budget}
                currency={currency}
                onDelete={setDeletingBudget}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Add Budget Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Budget">
        <form onSubmit={handleSubmit(d => createMutation.mutate(d))} className="space-y-4">
          <Select label="Category" {...register('category')} error={errors.category?.message}>
            <option value="">Select a category</option>
            {expenseCategories.map(c => (
              <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>
            ))}
          </Select>

          <Input label="Monthly Limit" type="number" step="0.01" placeholder="0.00"
            {...register('amount')} error={errors.amount?.message} />

          <Input label="Month" type="month" {...register('month')} error={errors.month?.message} />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={createMutation.isPending}>Set Budget</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deletingBudget} onClose={() => setDeletingBudget(null)} title="Remove Budget">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Remove budget for <strong className="text-gray-900 dark:text-white">{deletingBudget?.category?.name}</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingBudget(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" isLoading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deletingBudget._id)}>
            Remove
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Budgets;
