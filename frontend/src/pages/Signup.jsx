import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { CURRENCY_OPTIONS } from '../utils/constants';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  currency: z.string().min(1, 'Please select a currency'),
});

const Signup = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { currency: 'USD' }
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        (error.code === 'ERR_NETWORK' ? 'Unable to connect to server. Please verify backend is running on port 5000.' : error.message) ||
        'Failed to create account';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-primary-600 mb-6">
            <ShieldCheck className="w-10 h-10" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">ExpenseCap</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-gray-500 mt-2">100% Free. No credit card required.</p>
        </div>

        <Card padding="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={User}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />

            <Select
              label="Currency"
              options={CURRENCY_OPTIONS}
              error={errors.currency?.message}
              {...register('currency')}
            />

            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              isLoading={isSubmitting}
            >
              Get Started Free
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
