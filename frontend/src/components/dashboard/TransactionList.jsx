import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dates';

const TransactionList = ({ transactions, currency = 'USD' }) => {
  if (!transactions?.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No recent transactions found.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {transactions.map((tx) => (
        <div key={tx.id || tx._id} className="py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 rounded-lg transition-colors -mx-2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
              {tx.category?.icon || '📝'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.description || tx.category?.name || 'Transaction'}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatDate(tx.date)}</span>
                <span>•</span>
                <span>{tx.wallet?.name}</span>
              </div>
            </div>
          </div>
          <div className={`text-sm font-bold ${
            tx.type === 'income' 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : tx.type === 'expense' 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-500'
          }`}>
            {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
            {formatCurrency(tx.amount, currency)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
