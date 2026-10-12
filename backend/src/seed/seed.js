import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Goal from '../models/Goal.js';
import Loan from '../models/Loan.js';
import FixedCost from '../models/FixedCost.js';
import { defaultCategories } from '../utils/defaultCategories.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing
    await User.deleteMany();
    await Wallet.deleteMany();
    await Category.deleteMany();
    await Transaction.deleteMany();
    await Budget.deleteMany();
    await Goal.deleteMany();
    await Loan.deleteMany();
    await FixedCost.deleteMany();

    // Create user
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@expensecap.io',
      password: 'Demo@1234'
    });

    // Categories
    const categoriesToInsert = defaultCategories.map(cat => ({ ...cat, user: user._id }));
    const categories = await Category.insertMany(categoriesToInsert);

    // Wallets
    const cashWallet = await Wallet.create({ user: user._id, name: 'Cash', type: 'cash', balance: 50000, color: '#FF5733', icon: 'cash-icon' });
    const bankWallet = await Wallet.create({ user: user._id, name: 'Chase Bank', type: 'bank', balance: 450000, color: '#3357FF', icon: 'bank-icon' });
    const cardWallet = await Wallet.create({ user: user._id, name: 'Credit Card', type: 'card', balance: -50000, color: '#FFC300', icon: 'card-icon' });
    const wallets = [cashWallet, bankWallet, cardWallet];

    // Budgets
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const foodCategory = categories.find(c => c.name === 'Food & Dining');
    const transportCategory = categories.find(c => c.name === 'Transport');
    
    await Budget.create([
      { user: user._id, category: foodCategory._id, amount: 40000, month: currentMonth }, // $400
      { user: user._id, category: transportCategory._id, amount: 15000, month: currentMonth } // $150
    ]);

    // Goals
    await Goal.create([
      { 
        user: user._id, name: 'New Laptop', targetAmount: 150000, savedAmount: 50000, deadline: new Date(now.getFullYear(), now.getMonth() + 3, 1), emoji: '💻', color: '#8E44AD',
        contributions: [{ amount: 50000, note: 'Initial savings' }]
      },
      { 
        user: user._id, name: 'Vacation', targetAmount: 200000, savedAmount: 0, deadline: new Date(now.getFullYear(), now.getMonth() + 6, 1), emoji: '🏖️', color: '#1ABC9C',
        contributions: []
      }
    ]);

    // Loans
    await Loan.create({
      user: user._id, type: 'lent', counterparty: 'Alice', principal: 10000, dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 1), note: 'Dinner split'
    });

    // Fixed Costs
    const rentCategory = categories.find(c => c.name === 'Rent');
    await FixedCost.create([
      { user: user._id, name: 'Apartment Rent', amount: 120000, frequency: 'monthly', category: rentCategory._id, wallet: bankWallet._id, nextDueDate: new Date(now.getFullYear(), now.getMonth() + 1, 1) },
      { user: user._id, name: 'Netflix', amount: 1500, frequency: 'monthly', category: categories.find(c => c.name === 'Entertainment')._id, wallet: cardWallet._id, nextDueDate: new Date(now.getFullYear(), now.getMonth() + 1, 15) }
    ]);

    // Transactions
    const transactions = [];
    const salaryCat = categories.find(c => c.name === 'Salary');
    for (let i = 0; i < 90; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Income (Salary on 1st of month)
      if (date.getDate() === 1) {
        transactions.push({ user: user._id, wallet: bankWallet._id, category: salaryCat._id, type: 'income', amount: 300000, note: 'Salary', date });
      }

      // Random expense every few days
      if (i % 2 === 0) {
        const amount = Math.floor(Math.random() * 5000) + 500;
        transactions.push({ user: user._id, wallet: wallets[Math.floor(Math.random() * 3)]._id, category: categories[Math.floor(Math.random() * 10)]._id, type: 'expense', amount, note: 'Random expense', date });
      }
    }
    await Transaction.insertMany(transactions);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
