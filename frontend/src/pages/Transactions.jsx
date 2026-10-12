import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Filter, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transaction.api';
import { getWallets } from '../api/wallet.api';
import { getCategories } from '../api/category.api';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/dates';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

/* ─── Zod schema ─────────────────────────────────────────────────── */
const txSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Amount must be positive'),
  wallet: z.string().min(1, 'Select a wallet'),
  category: z.string().min(1, 'Select a category'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
});

/* ─── TransactionRow ─────────────────────────────────────────────── */
function TransactionRow({ tx, currency, onEdit, onDelete }) {
  const isIncome = tx.type === 'income';
  return (
    <div className="flex items-center gap-3 py-3 px-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg bg-gray-100 dark:bg-gray-700 shrink-0">
        {tx.category?.emoji || '💸'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {tx.note || tx.category?.name || 'Transaction'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {tx.wallet?.name} · {formatDate(tx.date)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-semibold text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
        </p>
        <p className="text-xs text-gray-400 capitalize">{tx.type}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex gap-1 shrink-0 transition-opacity">
        <button onClick={() => onEdit(tx)} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500">
          <Pencil size={13} />
        </button>
        <button onClick={() => onDelete(tx)} className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─── TransactionModal ───────────────────────────────────────────── */
function TransactionModal({ open, onClose, editing, wallets, categories, currency }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(txSchema),
    defaultValues: editing
      ? {
          type: editing.type,
          amount: editing.amount / 100,
          wallet: editing.wallet?._id || editing.wallet,
          category: editing.category?._id || editing.category,
          date: editing.date ? new Date(editing.date).toISOString().slice(0, 10) : '',
          note: editing.note || '',
        }
      : { type: 'expense', date: new Date().toISOString().slice(0, 10) },
  });

  const selectedType = watch('type');
  const filteredCats = categories.filter(c => c.type === selectedType || c.type === 'both');

  const mutation = useMutation({
    mutationFn: editing
      ? (data) => updateTransaction(editing._id, data)
      : createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success(editing ? 'Transaction updated!' : 'Transaction added!');
      reset();
      onClose();
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to save'),
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, amount: Math.round(data.amount * 100) });
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {['expense', 'income'].map((t) => (
            <label key={t} className={`flex-1 text-center py-2 rounded-md text-sm font-medium cursor-pointer transition-colors
              ${selectedType === t
                ? (t === 'income' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              <input type="radio" {...register('type')} value={t} className="sr-only" />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>

        <Input label="Amount" type="number" step="0.01" placeholder="0.00"
          {...register('amount')} error={errors.amount?.message} />

        <Select label="Wallet" {...register('wallet')} error={errors.wallet?.message}>
          <option value="">Select wallet</option>
          {wallets.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
        </Select>

        <Select label="Category" {...register('category')} error={errors.category?.message}>
          <option value="">Select category</option>
          {filteredCats.map(c => <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>)}
        </Select>

        <Input label="Date" type="date" {...register('date')} error={errors.date?.message} />
        <Input label="Note (optional)" placeholder="What was this for?" {...register('note')} />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" isLoading={mutation.isPending}>
            {editing ? 'Update' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Delete Confirm ─────────────────────────────────────────────── */
function DeleteConfirm({ tx, onConfirm, onCancel, isLoading }) {
  if (!tx) return null;
  return (
    <Modal open={!!tx} onClose={onCancel} title="Delete Transaction">
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to delete this transaction?
        <span className="block mt-1 font-medium text-gray-900 dark:text-white">
          "{tx.note || tx.category?.name}" — {formatCurrency(tx.amount, 'USD')}
        </span>
      </p>
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" className="flex-1" onClick={onConfirm} isLoading={isLoading}>Delete</Button>
      </div>
    </Modal>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
const Transactions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currency = user?.currency || 'USD';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', category: '', wallet: '', startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deletingTx, setDeletingTx] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, debouncedSearch, filters],
    queryFn: () => getTransactions({ page, limit: 20, search: debouncedSearch, ...filters }),
    keepPreviousData: true,
  });

  const { data: walletsData } = useQuery({ queryKey: ['wallets'], queryFn: getWallets });
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const wallets = walletsData?.data || walletsData || [];
  const categories = categoriesData?.data || categoriesData || [];
  const transactions = data?.data || [];
  const pagination = data?.pagination || {};

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success('Transaction deleted');
      setDeletingTx(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const handleEdit = (tx) => { setEditingTx(tx); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditingTx(null); };
  const clearFilter = (key) => setFilters(f => ({ ...f, [key]: '' }));

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          {pagination.total != null && (
            <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total transactions</p>
          )}
        </div>
        <Button icon={Plus} onClick={() => { setEditingTx(null); setModalOpen(true); }}>
          Add Transaction
        </Button>
      </div>

      {/* Search + Filter bar */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by note…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
              ${activeFilterCount > 0 ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <Filter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <select value={filters.type} onChange={e => { setFilters(f => ({ ...f, type: e.target.value })); setPage(1); }}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select value={filters.category} onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">All</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <input type="date" value={filters.startDate} onChange={e => { setFilters(f => ({ ...f, startDate: e.target.value })); setPage(1); }}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <input type="date" value={filters.endDate} onChange={e => { setFilters(f => ({ ...f, endDate: e.target.value })); setPage(1); }}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
        )}

        {/* Active filter tags */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.type && (
              <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                {filters.type} <button onClick={() => clearFilter('type')}><X size={12} /></button>
              </span>
            )}
            {filters.startDate && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                From {filters.startDate} <button onClick={() => clearFilter('startDate')}><X size={12} /></button>
              </span>
            )}
            {filters.endDate && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                To {filters.endDate} <button onClick={() => clearFilter('endDate')}><X size={12} /></button>
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Transaction list */}
      <Card>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">💸</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No transactions found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {Object.values(filters).some(Boolean) || search
                ? 'Try adjusting your filters'
                : 'Add your first transaction to get started'}
            </p>
            <Button icon={Plus} onClick={() => setModalOpen(true)}>Add Transaction</Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.map(tx => (
              <TransactionRow
                key={tx._id}
                tx={tx}
                currency={currency}
                onEdit={handleEdit}
                onDelete={setDeletingTx}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <TransactionModal
        open={modalOpen}
        onClose={handleCloseModal}
        editing={editingTx}
        wallets={wallets}
        categories={categories}
        currency={currency}
      />
      <DeleteConfirm
        tx={deletingTx}
        onCancel={() => setDeletingTx(null)}
        onConfirm={() => deleteMutation.mutate(deletingTx._id)}
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
};

export default Transactions;
