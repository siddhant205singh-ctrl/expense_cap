import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <Card header={<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>}>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-gray-900 dark:text-white">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-900 dark:text-white">{user?.email}</p>
          </div>
        </div>
      </Card>
      
      <Card header={<h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>}>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Log out of your account on this device.</p>
          <Button variant="danger" icon={LogOut} onClick={logout}>Sign Out</Button>
        </div>
      </Card>
    </motion.div>
  );
};
export default Settings;
