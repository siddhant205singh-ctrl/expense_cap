import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { Wallet, CreditCard, Landmark, Smartphone, TrendingUp } from 'lucide-react';

const icons = {
  cash: Wallet,
  bank: Landmark,
  credit: CreditCard,
  mobile: Smartphone,
  investment: TrendingUp,
};

const WalletCard = ({ wallet, currency = 'USD' }) => {
  const Icon = icons[wallet.type] || Wallet;
  
  return (
    <Card className="hover:shadow-md transition-shadow relative overflow-hidden group border-l-4" style={{ borderLeftColor: wallet.color || '#10b981' }}>
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="p-3 rounded-xl bg-opacity-10 dark:bg-opacity-20"
          style={{ backgroundColor: `${wallet.color || '#10b981'}20`, color: wallet.color || '#10b981' }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{wallet.name}</h3>
          <p className="text-xs text-gray-500 capitalize">{wallet.type}</p>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(wallet.balance, currency)}
        </p>
      </div>
    </Card>
  );
};

export default WalletCard;
