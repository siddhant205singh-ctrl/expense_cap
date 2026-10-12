import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, CheckCircle, Calendar, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

import { getFixedCosts, createFixedCost, deleteFixedCost, markAsPaid } from '../api/fixedCost.api';
import { getCategories } from '../api/category.api';
import { getWallets } from '../api/wallet.api';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/dates';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

/* ─── Schemas ────────────────────────────────────────────────────── */
const fixedCostSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  amount: z.coerce.number().positive('Amount must be positive'),
  frequency: z.enum(['weekly', 'monthly', 'yearly']),
  category: z.string().min(1, 'Select a category'),
  wallet: z.string().min(1, 'Select a wallet'),
  nextDueDate: z.string().min(1, 'Due date is required'),
});

/* ─── Days until due ─────────────────────────────────────────────── */
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const due = new Date(dateStr);
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  return diff;
}

/* ─── Fixed Cost Card ────────────────────────────────────────────── */
function FixedCostCard({ item, currency, onPay, onDelete }) {
  const days = daysUntil(item.nextDueDate);
  const isOverdue = days !== null && days < 0;
  const isDueSoon = days !== null && days >= 0 && days <= 3;

  const freqColors = {
    weekly: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    monthly: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    yearly: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 hover:shadow-md transition-shadow group
        ${isOverdue ? 'border-red-200 dark:border-red-800' : isDueSoon ? 'border-amber-200 dark:border-amber-800' : 'border-gray-100 dark:border-gray-700'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
            {item.category?.emoji || '💳'}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
            <p className="text-xs text-gray-400">{item.category?.name}</p>
          </div>
        </div>
        <button onClick={() => onDelete(item)}
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(item.amount, currency)}</p>
        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${freqColors[item.frequency]}`}>
          <RefreshCw size={10} className="inline mr-1" />{item.frequency}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Calendar size={13} className="text-gray-400" />
        <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-amber-500' : 'text-gray-500'}`}>
          {isOverdue
            ? `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`
            : days === 0
              ? 'Due today!'
              : `Due in ${days} day${days !== 1 ? 's' : ''} (${formatDate(item.nextDueDate)})`}
        </span>
      </div>

      {item.lastPaidDate && (
        <p className="text-xs text-gray-400 mt-1">Last paid: {formatDate(item.lastPaidDate)}</p>
      )}

      <div className="mt-4">
        <Button variant={isOverdue ? 'danger' : 'secondary'} size="sm" icon={CheckCircle}
          className="w-full" onClick={() => onPay(item)}>
          Mark as Paid
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
const FixedCosts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currency = user?.currency || 'USD';

  const [addOpen, setAddOpen] = useState(false);
  const [payingItem, setPayingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['fixedCosts'], queryFn: getFixedCosts });
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: walletsData } = useQuery({ queryKey: ['wallets'], queryFn: getWallets });

  const fixedCosts = Array.isArray(data) ? data : (data?.data || []);
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);
  const wallets = Array.isArray(walletsData) ? walletsData : (walletsData?.data || []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(fixedCostSchema),
    defaultValues: { frequency: 'monthly', nextDueDate: new Date().toISOString().slice(0, 10) },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createFixedCost({ ...data, amount: Math.round(data.amount * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedCosts'] });
      toast.success('Fixed cost added!');
      reset({ frequency: 'monthly', nextDueDate: new Date().toISOString().slice(0, 10) });
      setAddOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to save'),
  });

  const payMutation = useMutation({
    mutationFn: (id) => markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedCosts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast.success('Marked as paid! Transaction created.');
      setPayingItem(null);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to mark as paid'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteFixedCost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedCosts'] });
      toast.success('Fixed cost removed');
      setDeletingItem(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const overdue = fixedCosts.filter(f => daysUntil(f.nextDueDate) < 0);
  const dueSoon = fixedCosts.filter(f => { const d = daysUntil(f.nextDueDate); return d >= 0 && d <= 7; });
  const totalMonthly = fixedCosts.reduce((s, f) => {
    if (f.frequency === 'monthly') return s + f.amount;
    if (f.frequency === 'weekly') return s + f.amount * 4.33;
    if (f.frequency === 'yearly') return s + f.amount / 12;
    return s;
  }, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fixed Costs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            ~{formatCurrency(Math.round(totalMonthly), currency)}/month in recurring bills
          </p>
        </div>
        <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Fixed Cost</Button>
      </div>

      {/* Alerts */}
      {overdue.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            🚨 {overdue.length} overdue: {overdue.map(f => f.name).join(', ')}
          </p>
        </div>
      )}
      {dueSoon.length > 0 && overdue.length === 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            ⏰ {dueSoon.length} due within 7 days: {dueSoon.map(f => f.name).join(', ')}
          </p>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : fixedCosts.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No fixed costs yet</h3>
            <p className="text-gray-500 text-sm mb-6">Add your recurring bills: rent, subscriptions, utilities</p>
            <Button icon={Plus} onClick={() => setAddOpen(true)}>Add First Fixed Cost</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fixedCosts.map(item => (
            <FixedCostCard key={item._id} item={item} currency={currency}
              onPay={setPayingItem} onDelete={setDeletingItem} />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Fixed Cost">
        <form onSubmit={handleSubmit(d => createMutation.mutate(d))} className="space-y-4">
          <Input label="Name" placeholder="e.g. Netflix, Rent, Insurance" {...register('name')} error={errors.name?.message} />
          <Input label="Amount" type="number" step="0.01" placeholder="0.00" {...register('amount')} error={errors.amount?.message} />
          <Select label="Frequency" {...register('frequency')} error={errors.frequency?.message}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
          <Select label="Category" {...register('category')} error={errors.category?.message}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>)}
          </Select>
          <Select label="Pay from Wallet" {...register('wallet')} error={errors.wallet?.message}>
            <option value="">Select wallet</option>
            {wallets.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
          </Select>
          <Input label="Next Due Date" type="date" {...register('nextDueDate')} error={errors.nextDueDate?.message} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={createMutation.isPending}>Add</Button>
          </div>
        </form>
      </Modal>

      {/* Pay Confirm */}
      <Modal open={!!payingItem} onClose={() => setPayingItem(null)} title="Mark as Paid">
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Mark <strong className="text-gray-900 dark:text-white">{payingItem?.name}</strong> as paid?
        </p>
        <p className="text-sm text-gray-500 mb-6">
          This will create a {formatCurrency(payingItem?.amount, currency)} expense transaction in <strong>{payingItem?.wallet?.name || 'the linked wallet'}</strong> and update the next due date.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setPayingItem(null)}>Cancel</Button>
          <Button className="flex-1" isLoading={payMutation.isPending} onClick={() => payMutation.mutate(payingItem._id)}>
            Confirm Payment
          </Button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deletingItem} onClose={() => setDeletingItem(null)} title="Remove Fixed Cost">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Remove <strong className="text-gray-900 dark:text-white">{deletingItem?.name}</strong> from your recurring bills?
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingItem(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" isLoading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deletingItem._id)}>Remove</Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default FixedCosts;
