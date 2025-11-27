export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color: string;
  userId?: string; // Optional for system defaults
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId: string;
  categoryName: string;
  date: string; // ISO Date string YYYY-MM-DD
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
  percentage: number;
}
