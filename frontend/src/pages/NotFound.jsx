import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Page not found</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL?
        </p>
        <Link to="/">
          <Button icon={Home} size="lg">Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
