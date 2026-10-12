import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, PlusCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { getLoans, createLoan, deleteLoan, addRepayment } from '../api/loan.api';
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
const loanSchema = z.object({
  type: z.enum(['borrowed', 'lent']),
  counterparty: z.string().min(1, 'Name is required'),
  principal: z.coerce.number().positive('Amount must be positive'),
  dueDate: z.string().optional(),
  note: z.string().optional(),
});

const repaymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  note: z.string().optional(),
  date: z.string().optional(),
});

/* ─── Loan Card ──────────────────────────────────────────────────── */
function LoanCard({ loan, currency, onRepay, onDelete }) {
  const totalRepaid = loan.repayments?.reduce((s, r) => s + r.amount, 0) || 0;
  const remaining = loan.principal - totalRepaid;
  const pct = loan.principal > 0 ? Math.round((totalRepaid / loan.principal) * 100) : 0;
  const isSettled = remaining <= 0 || loan.isSettled;
  const isBorrowed = loan.type === 'borrowed';

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 dark:text-white">{loan.counterparty}</p>
            <Badge variant={isBorrowed ? 'danger' : 'info'} className="text-xs">
              {isBorrowed ? 'Borrowed' : 'Lent'}
            </Badge>
            {isSettled && <Badge variant="success" className="text-xs flex items-center gap-1"><CheckCircle2 size={10} /> Settled</Badge>}
          </div>
          {loan.dueDate && (
            <p className="text-xs text-gray-400 mt-0.5">Due {formatDate(loan.dueDate)}</p>
          )}
          {loan.note && <p className="text-xs text-gray-500 mt-1 italic">{loan.note}</p>}
        </div>
        <button onClick={() => onDelete(loan)}
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Principal</p>
          <p className="font-semibold text-sm text-gray-900 dark:text-white">{formatCurrency(loan.principal, currency)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Repaid</p>
          <p className="font-semibold text-sm text-emerald-600">{formatCurrency(totalRepaid, currency)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Remaining</p>
          <p className={`font-semibold text-sm ${remaining > 0 ? (isBorrowed ? 'text-red-500' : 'text-amber-500') : 'text-emerald-600'}`}>
            {formatCurrency(Math.max(remaining, 0), currency)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% repaid</p>
      </div>

      {!isSettled && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" icon={PlusCircle} className="w-full" onClick={() => onRepay(loan)}>
            Add Repayment
          </Button>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
const Loans = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currency = user?.currency || 'USD';

  const [addOpen, setAddOpen] = useState(false);
  const [repayLoan, setRepayLoan] = useState(null);
  const [deletingLoan, setDeletingLoan] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['loans'], queryFn: getLoans });
  const loans = Array.isArray(data) ? data : (data?.data || []);
  const borrowed = loans.filter(l => l.type === 'borrowed');
  const lent = loans.filter(l => l.type === 'lent');

  const totalBorrowed = borrowed.reduce((s, l) => s + (l.principal - (l.repayments?.reduce((a, r) => a + r.amount, 0) || 0)), 0);
  const totalLent = lent.reduce((s, l) => s + (l.principal - (l.repayments?.reduce((a, r) => a + r.amount, 0) || 0)), 0);

  /* Create loan */
  const { register: regLoan, handleSubmit: handleLoan, reset: resetLoan, formState: { errors: errLoan } } = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: { type: 'borrowed' },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createLoan({ ...data, principal: Math.round(data.principal * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Loan recorded!');
      resetLoan({ type: 'borrowed' });
      setAddOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to save'),
  });

  /* Add repayment */
  const { register: regRepay, handleSubmit: handleRepay, reset: resetRepay, formState: { errors: errRepay } } = useForm({
    resolver: zodResolver(repaymentSchema),
    defaultValues: { date: new Date().toISOString().slice(0, 10) },
  });

  const repayMutation = useMutation({
    mutationFn: ({ loanId, data }) => addRepayment(loanId, { ...data, amount: Math.round(data.amount * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Repayment recorded!');
      resetRepay({ date: new Date().toISOString().slice(0, 10) });
      setRepayLoan(null);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to add repayment'),
  });

  /* Delete */
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Loan removed');
      setDeletingLoan(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const LoanSection = ({ title, items, emptyMsg }) => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 text-sm py-6">{emptyMsg}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(loan => (
            <LoanCard key={loan._id} loan={loan} currency={currency}
              onRepay={setRepayLoan} onDelete={setDeletingLoan} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loans</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track money borrowed and lent</p>
        </div>
        <Button icon={Plus} onClick={() => setAddOpen(true)}>Record Loan</Button>
      </div>

      {/* Summary */}
      {loans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-red-100 dark:border-red-900/30">
            <p className="text-xs text-gray-500 uppercase tracking-wider">You Owe</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(Math.max(totalBorrowed, 0), currency)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{borrowed.length} loan{borrowed.length !== 1 ? 's' : ''}</p>
          </Card>
          <Card className="border-emerald-100 dark:border-emerald-900/30">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Owed to You</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(Math.max(totalLent, 0), currency)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{lent.length} loan{lent.length !== 1 ? 's' : ''}</p>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : loans.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No loans recorded</h3>
            <p className="text-gray-500 text-sm mb-6">Track money you've borrowed or lent to others</p>
            <Button icon={Plus} onClick={() => setAddOpen(true)}>Record First Loan</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          <LoanSection title="💳 Money I Borrowed" items={borrowed} emptyMsg="No borrowed loans. Great debt-free status!" />
          <LoanSection title="💵 Money I Lent" items={lent} emptyMsg="You haven't lent any money." />
        </div>
      )}

      {/* Add Loan Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Record a Loan">
        <form onSubmit={handleLoan(d => createMutation.mutate(d))} className="space-y-4">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {[{ value: 'borrowed', label: 'I Borrowed' }, { value: 'lent', label: 'I Lent' }].map(t => {
              const { ref: typeRef, ...rest } = regLoan('type');
              return (
                <label key={t.value} className="flex-1 text-center">
                  <input type="radio" value={t.value} className="sr-only" {...regLoan('type')} />
                  <span className={`block py-2 rounded-md text-sm font-medium cursor-pointer transition-colors`}>
                    {t.label}
                  </span>
                </label>
              );
            })}
          </div>
          <Input label="Person / Organization" placeholder="e.g. John Smith" {...regLoan('counterparty')} error={errLoan.counterparty?.message} />
          <Input label="Amount" type="number" step="0.01" placeholder="0.00" {...regLoan('principal')} error={errLoan.principal?.message} />
          <Input label="Due Date (optional)" type="date" {...regLoan('dueDate')} />
          <Input label="Note (optional)" placeholder="What's this loan for?" {...regLoan('note')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={createMutation.isPending}>Record Loan</Button>
          </div>
        </form>
      </Modal>

      {/* Repayment Modal */}
      <Modal open={!!repayLoan} onClose={() => setRepayLoan(null)} title={`Add Repayment — ${repayLoan?.counterparty}`}>
        <form onSubmit={handleRepay(d => repayMutation.mutate({ loanId: repayLoan._id, data: d }))} className="space-y-4">
          <Input label="Amount" type="number" step="0.01" placeholder="0.00" {...regRepay('amount')} error={errRepay.amount?.message} />
          <Input label="Date" type="date" {...regRepay('date')} />
          <Input label="Note (optional)" placeholder="Repayment note" {...regRepay('note')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setRepayLoan(null)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={repayMutation.isPending}>Record Repayment</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deletingLoan} onClose={() => setDeletingLoan(null)} title="Delete Loan">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Delete loan with <strong className="text-gray-900 dark:text-white">{deletingLoan?.counterparty}</strong>? All repayments will be lost.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingLoan(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" isLoading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deletingLoan._id)}>Delete</Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Loans;
