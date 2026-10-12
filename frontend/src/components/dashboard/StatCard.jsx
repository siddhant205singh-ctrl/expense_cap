import Card from '../ui/Card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const StatCard = ({ title, amount, currency = 'USD', change, icon: Icon, type = 'neutral' }) => {
  const isPositive = change >= 0;
  
  const colors = {
    neutral: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    danger: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <Card padding="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(amount, currency)}
          </p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors[type]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {change !== undefined && change !== null && (
        <div className="mt-4 flex items-center text-sm">
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400">vs last month</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
