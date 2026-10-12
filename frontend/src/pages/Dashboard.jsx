import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { getDashboardSummary } from '../api/insight.api';
import StatCard from '../components/dashboard/StatCard';
import TransactionList from '../components/dashboard/TransactionList';
import GoalCard from '../components/dashboard/GoalCard';
import BudgetBar from '../components/dashboard/BudgetBar';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { getCurrentMonth } from '../utils/dates';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const currentMonth = getCurrentMonth();
  
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardSummary', currentMonth],
    queryFn: () => getDashboardSummary(currentMonth),
  });

  const summary = data?.summary || {
    totalBalance: 0,
    monthIncome: 0,
    monthExpense: 0,
    netIncome: 0,
    balanceChange: 0,
    incomeChange: 0,
    expenseChange: 0
  };

  const recentTransactions = data?.recentTransactions || [];
  const activeGoals = data?.activeGoals || [];
  const budgets = data?.budgets || [];
  const currency = user?.preferences?.currency || 'USD';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Balance" 
          amount={summary.totalBalance} 
          currency={currency}
          icon={Wallet} 
          change={summary.balanceChange}
        />
        <StatCard 
          title="Monthly Income" 
          amount={summary.monthIncome} 
          currency={currency}
          icon={TrendingUp} 
          type="success"
          change={summary.incomeChange}
        />
        <StatCard 
          title="Monthly Expense" 
          amount={summary.monthExpense} 
          currency={currency}
          icon={TrendingDown} 
          type="danger"
          change={summary.expenseChange}
        />
        <StatCard 
          title="Net Income" 
          amount={summary.netIncome} 
          currency={currency}
          icon={DollarSign} 
          type={summary.netIncome >= 0 ? 'success' : 'danger'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card 
            header={<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>}
          >
            <TransactionList transactions={recentTransactions} currency={currency} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card 
            header={<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Overview</h2>}
          >
            {budgets.length > 0 ? (
              <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                {budgets.slice(0, 4).map(budget => (
                  <BudgetBar key={budget.id || budget._id} budget={budget} currency={currency} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No budgets set for this month.</p>
            )}
          </Card>

          <Card 
            header={<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h2>}
          >
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                {activeGoals.slice(0, 3).map(goal => (
                  <GoalCard key={goal.id || goal._id} goal={goal} currency={currency} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No active goals.</p>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
