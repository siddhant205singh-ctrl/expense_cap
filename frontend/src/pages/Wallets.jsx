import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, ArrowRightLeft, Pencil, Trash2, Wallet as WalletIcon, Building2, Smartphone, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

import { getWallets, createWallet, updateWallet, deleteWallet, transferBetweenWallets } from '../api/wallet.api';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';
import { WALLET_TYPES } from '../utils/constants';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Skeleton from '../components/ui/Skeleton';

/* ─── Wallet type icon map ───────────────────────────────────────── */
const TypeIcon = ({ type, size = 20 }) => {
  const icons = {
    cash: WalletIcon,
    bank: Building2,
    mobile_banking: Smartphone,
    card: CreditCard,
  };
  const Icon = icons[type] || WalletIcon;
  return <Icon size={size} />;
};

/* ─── Wallet color options ───────────────────────────────────────── */
const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

/* ─── Zod schemas ────────────────────────────────────────────────── */
const walletSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  type: z.enum(['cash', 'bank', 'mobile_banking', 'card']),
  color: z.string().min(1),
  openingBalance: z.coerce.number().min(0).default(0),
});

const transferSchema = z.object({
  fromWallet: z.string().min(1, 'Select source wallet'),
  toWallet: z.string().min(1, 'Select destination wallet'),
  amount: z.coerce.number().positive('Amount must be positive'),
  note: z.string().optional(),
}).refine(d => d.fromWallet !== d.toWallet, {
  message: 'Source and destination must be different',
  path: ['toWallet'],
});

/* ─── WalletCard component ───────────────────────────────────────── */
function WalletDisplayCard({ wallet, currency, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow group overflow-hidden"
    >
      {/* Color accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: wallet.color || '#10b981' }} />

      <div className="flex items-start justify-between mt-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: wallet.color || '#10b981' }}>
            <TypeIcon type={wallet.type} size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{wallet.name}</p>
            <p className="text-xs text-gray-500 capitalize">{wallet.type?.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
          <button onClick={() => onEdit(wallet)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(wallet)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Balance</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {formatCurrency(wallet.balance, currency)}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Wallet Modal ───────────────────────────────────────────────── */
function WalletModal({ open, onClose, editing }) {
  const queryClient = useQueryClient();
  const [selectedColor, setSelectedColor] = useState(editing?.color || COLORS[0]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(walletSchema),
    defaultValues: editing
      ? { name: editing.name, type: editing.type, color: editing.color, openingBalance: editing.balance / 100 }
      : { type: 'cash', color: COLORS[0], openingBalance: 0 },
  });

  const mutation = useMutation({
    mutationFn: editing
      ? (data) => updateWallet(editing._id, data)
      : createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success(editing ? 'Wallet updated!' : 'Wallet created!');
      reset();
      onClose();
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to save wallet'),
  });

  const onSubmit = (data) => {
    mutation.mutate({ 
      ...data, 
      color: selectedColor, 
      balance: Math.round(data.openingBalance * 100),
      icon: data.type
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Wallet' : 'Add Wallet'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Wallet Name" placeholder="e.g. Main Bank Account" {...register('name')} error={errors.name?.message} />

        <Select label="Type" {...register('type')} error={errors.type?.message}>
          {WALLET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>

        {!editing && (
          <Input label="Opening Balance" type="number" step="0.01" placeholder="0.00"
            {...register('openingBalance')} error={errors.openingBalance?.message} />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setSelectedColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" isLoading={mutation.isPending}>
            {editing ? 'Update' : 'Create Wallet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Transfer Modal ─────────────────────────────────────────────── */
function TransferModal({ open, onClose, wallets, currency }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(transferSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => transferBetweenWallets({ ...data, amount: Math.round(data.amount * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success('Transfer completed!');
      reset();
      onClose();
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Transfer failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Transfer Between Wallets">
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <Select label="From Wallet" {...register('fromWallet')} error={errors.fromWallet?.message}>
          <option value="">Select source</option>
          {wallets.map(w => <option key={w._id} value={w._id}>{w.name} ({formatCurrency(w.balance, currency)})</option>)}
        </Select>

        <Select label="To Wallet" {...register('toWallet')} error={errors.toWallet?.message}>
          <option value="">Select destination</option>
          {wallets.map(w => <option key={w._id} value={w._id}>{w.name} ({formatCurrency(w.balance, currency)})</option>)}
        </Select>

        <Input label="Amount" type="number" step="0.01" placeholder="0.00"
          {...register('amount')} error={errors.amount?.message} />
        <Input label="Note (optional)" placeholder="Transfer memo" {...register('note')} />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" isLoading={mutation.isPending}>Transfer</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
const Wallets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currency = user?.currency || 'USD';

  const [addOpen, setAddOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [deletingWallet, setDeletingWallet] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['wallets'], queryFn: getWallets });
  const wallets = Array.isArray(data) ? data : (data?.data || []);
  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast.success('Wallet deleted');
      setDeletingWallet(null);
    },
    onError: () => toast.error('Failed to delete wallet'),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallets & Accounts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: <span className="font-semibold text-emerald-600">{formatCurrency(totalBalance, currency)}</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={ArrowRightLeft} onClick={() => setTransferOpen(true)}>
            Transfer
          </Button>
          <Button icon={Plus} onClick={() => { setEditingWallet(null); setAddOpen(true); }}>
            Add Wallet
          </Button>
        </div>
      </div>

      {/* Wallet grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : wallets.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">👛</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No wallets yet</h3>
            <p className="text-gray-500 text-sm mb-6">Add your first wallet to start tracking your finances</p>
            <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Wallet</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {wallets.map(wallet => (
            <WalletDisplayCard
              key={wallet._id}
              wallet={wallet}
              currency={currency}
              onEdit={(w) => { setEditingWallet(w); setAddOpen(true); }}
              onDelete={setDeletingWallet}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <WalletModal
        open={addOpen}
        onClose={() => { setAddOpen(false); setEditingWallet(null); }}
        editing={editingWallet}
      />

      {/* Transfer Modal */}
      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        wallets={wallets}
        currency={currency}
      />

      {/* Delete Confirm */}
      <Modal open={!!deletingWallet} onClose={() => setDeletingWallet(null)} title="Delete Wallet">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{deletingWallet?.name}"</strong>?
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingWallet(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1"
            isLoading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deletingWallet._id)}>
            Delete
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Wallets;
