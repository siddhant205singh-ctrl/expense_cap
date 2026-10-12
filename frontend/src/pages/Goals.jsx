import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, PlusCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { getGoals, createGoal, deleteGoal, addContribution } from '../api/goal.api';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/dates';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';

/* ─── Schemas ────────────────────────────────────────────────────── */
const goalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  targetAmount: z.coerce.number().positive('Target must be positive'),
  deadline: z.string().optional(),
  emoji: z.string().optional(),
  color: z.string().optional(),
});

const contributionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  note: z.string().optional(),
  date: z.string().optional(),
});

/* ─── Progress Ring ──────────────────────────────────────────────── */
function ProgressRing({ pct, color = '#10b981', size = 80 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(pct, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={8} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={8} fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

/* ─── Goal Card ──────────────────────────────────────────────────── */
function GoalDisplayCard({ goal, currency, onContribute, onDelete }) {
  const pct = goal.targetAmount > 0 ? Math.round((goal.savedAmount / goal.targetAmount) * 100) : 0;
  const isComplete = pct >= 100 || goal.isCompleted;
  const remaining = goal.targetAmount - goal.savedAmount;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.emoji || '🎯'}</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{goal.name}</p>
            {goal.deadline && (
              <p className="text-xs text-gray-400">Due {formatDate(goal.deadline)}</p>
            )}
          </div>
        </div>
        {isComplete && <Badge variant="success" className="text-xs flex items-center gap-1"><CheckCircle2 size={10} /> Completed</Badge>}
      </div>

      <div className="flex items-center gap-4 mt-5">
        <div className="relative shrink-0">
          <ProgressRing pct={pct} color={goal.color || '#10b981'} size={72} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{pct}%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(goal.savedAmount, currency)}</p>
          <p className="text-xs text-gray-500">of {formatCurrency(goal.targetAmount, currency)}</p>
          {!isComplete && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatCurrency(remaining, currency)} remaining
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {!isComplete && (
          <Button variant="secondary" size="sm" icon={PlusCircle} className="flex-1" onClick={() => onContribute(goal)}>
            Add Funds
          </Button>
        )}
        <button onClick={() => onDelete(goal)}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
const Goals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currency = user?.currency || 'USD';

  const [addOpen, setAddOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['goals'], queryFn: getGoals });
  const goals = Array.isArray(data) ? data : (data?.data || []);

  /* Create goal */
  const { register: regGoal, handleSubmit: handleGoal, reset: resetGoal, formState: { errors: errGoal } } = useForm({
    resolver: zodResolver(goalSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createGoal({ ...data, targetAmount: Math.round(data.targetAmount * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal created!');
      resetGoal();
      setAddOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to create goal'),
  });

  /* Contribute */
  const { register: regContrib, handleSubmit: handleContrib, reset: resetContrib, formState: { errors: errContrib } } = useForm({
    resolver: zodResolver(contributionSchema),
    defaultValues: { date: new Date().toISOString().slice(0, 10) },
  });

  const contributeMutation = useMutation({
    mutationFn: ({ goalId, data }) => addContribution(goalId, { ...data, amount: Math.round(data.amount * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success('Contribution added!');
      resetContrib({ date: new Date().toISOString().slice(0, 10) });
      setContributeGoal(null);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to add contribution'),
  });

  /* Delete */
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal deleted');
      setDeletingGoal(null);
    },
    onError: () => toast.error('Failed to delete goal'),
  });

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  const totalSaved = goals.reduce((s, g) => s + (g.savedAmount || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + (g.targetAmount || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatCurrency(totalSaved, currency)} saved of {formatCurrency(totalTarget, currency)} total
          </p>
        </div>
        <Button icon={Plus} onClick={() => setAddOpen(true)}>New Goal</Button>
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Goals', value: goals.length, color: 'text-gray-900 dark:text-white' },
            { label: 'Active', value: activeGoals.length, color: 'text-blue-600' },
            { label: 'Completed', value: completedGoals.length, color: 'text-emerald-600' },
            { label: 'Total Saved', value: formatCurrency(totalSaved, currency), color: 'text-emerald-600', isCurrency: true },
          ].map(({ label, value, color }) => (
            <Card key={label} className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
              <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Goals grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No goals yet</h3>
            <p className="text-gray-500 text-sm mb-6">Create a savings goal and watch your progress grow</p>
            <Button icon={Plus} onClick={() => setAddOpen(true)}>Create First Goal</Button>
          </div>
        </Card>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Active</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeGoals.map(goal => (
                  <GoalDisplayCard key={goal._id} goal={goal} currency={currency}
                    onContribute={setContributeGoal} onDelete={setDeletingGoal} />
                ))}
              </div>
            </div>
          )}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Completed 🎉</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {completedGoals.map(goal => (
                  <GoalDisplayCard key={goal._id} goal={goal} currency={currency}
                    onContribute={setContributeGoal} onDelete={setDeletingGoal} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Goal Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Savings Goal">
        <form onSubmit={handleGoal(d => createMutation.mutate(d))} className="space-y-4">
          <div className="flex gap-3">
            <div className="w-20">
              <Input label="Emoji" placeholder="🎯" {...regGoal('emoji')} />
            </div>
            <div className="flex-1">
              <Input label="Goal Name" placeholder="e.g. Emergency Fund" {...regGoal('name')} error={errGoal.name?.message} />
            </div>
          </div>
          <Input label="Target Amount" type="number" step="0.01" placeholder="5000.00"
            {...regGoal('targetAmount')} error={errGoal.targetAmount?.message} />
          <Input label="Deadline (optional)" type="date" {...regGoal('deadline')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={createMutation.isPending}>Create Goal</Button>
          </div>
        </form>
      </Modal>

      {/* Contribute Modal */}
      <Modal open={!!contributeGoal} onClose={() => setContributeGoal(null)}
        title={`Add Funds — ${contributeGoal?.name}`}>
        <form onSubmit={handleContrib(d => contributeMutation.mutate({ goalId: contributeGoal._id, data: d }))} className="space-y-4">
          <Input label="Amount" type="number" step="0.01" placeholder="0.00"
            {...regContrib('amount')} error={errContrib.amount?.message} />
          <Input label="Date" type="date" {...regContrib('date')} />
          <Input label="Note (optional)" placeholder="What's this contribution for?" {...regContrib('note')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setContributeGoal(null)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={contributeMutation.isPending}>Add Funds</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deletingGoal} onClose={() => setDeletingGoal(null)} title="Delete Goal">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Delete goal <strong className="text-gray-900 dark:text-white">"{deletingGoal?.name}"</strong>? All contributions will be lost.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingGoal(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" isLoading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deletingGoal._id)}>Delete</Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Goals;
