import { Category } from './types';

export const APP_NAME = "FinTrack Pro";

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'inc-1', name: 'Salary', type: 'income', color: '#1E88E5', isDefault: true },
  { id: 'inc-2', name: 'Freelance', type: 'income', color: '#00BFA5', isDefault: true },
  { id: 'inc-3', name: 'Investments', type: 'income', color: '#7C4DFF', isDefault: true },
  { id: 'inc-4', name: 'Gifts', type: 'income', color: '#FF4081', isDefault: true },
  { id: 'inc-5', name: 'Other', type: 'income', color: '#90A4AE', isDefault: true },
];

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'exp-1', name: 'Food & Groceries', type: 'expense', color: '#EF5350', isDefault: true },
  { id: 'exp-2', name: 'Rent', type: 'expense', color: '#FF7043', isDefault: true },
  { id: 'exp-3', name: 'Utilities', type: 'expense', color: '#FFA726', isDefault: true },
  { id: 'exp-4', name: 'Transport', type: 'expense', color: '#FFCA28', isDefault: true },
  { id: 'exp-5', name: 'Entertainment', type: 'expense', color: '#66BB6A', isDefault: true },
  { id: 'exp-6', name: 'Health', type: 'expense', color: '#26A69A', isDefault: true },
  { id: 'exp-7', name: 'Shopping', type: 'expense', color: '#29B6F6', isDefault: true },
  { id: 'exp-8', name: 'Travel', type: 'expense', color: '#AB47BC', isDefault: true },
];

export const MOCK_USER_ID = "demo-user-123";

// Generate some sample transactions for the demo
const generateMockTransactions = () => {
  const txs = [];
  const today = new Date();
  
  // Salary
  txs.push({
    id: 'tx-1',
    type: 'income',
    amount: 5000,
    currency: 'USD',
    categoryId: 'inc-1',
    categoryName: 'Salary',
    date: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
    userId: MOCK_USER_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false
  });

  // Rent
  txs.push({
    id: 'tx-2',
    type: 'expense',
    amount: 1500,
    currency: 'USD',
    categoryId: 'exp-2',
    categoryName: 'Rent',
    date: new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split('T')[0],
    userId: MOCK_USER_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false
  });

  // Groceries
  txs.push({
    id: 'tx-3',
    type: 'expense',
    amount: 120.50,
    currency: 'USD',
    categoryId: 'exp-1',
    categoryName: 'Food & Groceries',
    date: new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0],
    notes: 'Weekly haul',
    userId: MOCK_USER_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false
  });

  return txs;
};

export const MOCK_TRANSACTIONS = generateMockTransactions();
