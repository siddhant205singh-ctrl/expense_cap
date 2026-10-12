import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatRelativeDate } from '../../utils/dates';

const GoalCard = ({ goal, currency = 'USD' }) => {
  const progress = Math.min(100, Math.max(0, (goal.savedAmount / goal.targetAmount) * 100));
  const strokeDasharray = 251.2; // 2 * pi * r (r=40)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  return (
    <Card className="flex items-center gap-6">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-100 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke={goal.color || '#10b981'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={goal.name}>
          {goal.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(goal.savedAmount, currency)}</span>
          <span className="mx-1">/</span>
          <span>{formatCurrency(goal.targetAmount, currency)}</span>
        </p>
        {goal.deadline && (
          <p className="text-xs text-gray-400 mt-2">
            Target: {formatRelativeDate(goal.deadline)}
          </p>
        )}
      </div>
    </Card>
  );
};

export default GoalCard;
