import { formatCurrency } from '../../utils/formatCurrency';
import ProgressBar from '../ui/ProgressBar';

const BudgetBar = ({ budget, currency = 'USD' }) => {
  const spent = budget.spentAmount || 0;
  const limit = budget.limit;
  const progress = (spent / limit) * 100;
  
  let warningState = 'normal';
  if (progress >= 100) warningState = 'exceeded';
  else if (progress >= 80) warningState = 'warning';

  return (
    <div className="py-3">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{budget.category?.icon || '📦'}</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{budget.category?.name || 'Category'}</p>
            {warningState === 'exceeded' && (
              <p className="text-xs text-red-500 font-medium mt-0.5">Budget exceeded!</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(spent, currency)}
          </p>
          <p className="text-xs text-gray-500">
            of {formatCurrency(limit, currency)}
          </p>
        </div>
      </div>
      <ProgressBar progress={progress} showLabel={false} />
    </div>
  );
};

export default BudgetBar;
