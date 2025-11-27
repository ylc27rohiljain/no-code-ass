import { Transaction, Category, User, AuthResponse, TransactionType } from '../types';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, MOCK_TRANSACTIONS, MOCK_USER_ID } from '../constants';

const STORAGE_KEYS = {
  TOKEN: 'fintrack_token',
  USER: 'fintrack_user',
  TRANSACTIONS: 'fintrack_transactions',
  CATEGORIES: 'fintrack_categories',
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private getStored<T>(key: string, defaultVal: T): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  }

  private setStored(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // --- Auth ---

  async login(email: string): Promise<AuthResponse> {
    await delay(800);
    // Simulating login - normally check password hash
    const user: User = {
      id: MOCK_USER_ID,
      name: 'Demo User',
      email: email,
      createdAt: new Date().toISOString(),
    };
    const token = "jwt-mock-token-" + Date.now();
    
    this.setStored(STORAGE_KEYS.USER, user);
    this.setStored(STORAGE_KEYS.TOKEN, token);

    // Initialize data if new
    const existingTxs = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!existingTxs) {
        this.setStored(STORAGE_KEYS.TRANSACTIONS, MOCK_TRANSACTIONS);
        this.setStored(STORAGE_KEYS.CATEGORIES, [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES]);
    }

    return { user, token };
  }

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  getCurrentUser(): User | null {
    return this.getStored<User | null>(STORAGE_KEYS.USER, null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // --- Transactions ---

  async getTransactions(filters?: { month?: string, type?: TransactionType }): Promise<Transaction[]> {
    await delay(400);
    let txs = this.getStored<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    txs = txs.filter(t => !t.deleted);

    if (filters?.type) {
      txs = txs.filter(t => t.type === filters.type);
    }
    if (filters?.month) {
      // month format YYYY-MM
      txs = txs.filter(t => t.date.startsWith(filters.month!));
    }
    
    // Sort by date desc
    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>): Promise<Transaction> {
    await delay(400);
    const newTx: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    };
    const txs = this.getStored<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    txs.push(newTx);
    this.setStored(STORAGE_KEYS.TRANSACTIONS, txs);
    return newTx;
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    await delay(300);
    const txs = this.getStored<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const idx = txs.findIndex(t => t.id === id);
    if (idx === -1) throw new Error("Transaction not found");
    
    const updated = { ...txs[idx], ...data, updatedAt: new Date().toISOString() };
    txs[idx] = updated;
    this.setStored(STORAGE_KEYS.TRANSACTIONS, txs);
    return updated;
  }

  async deleteTransaction(id: string): Promise<void> {
    await delay(300);
    const txs = this.getStored<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const idx = txs.findIndex(t => t.id === id);
    if (idx !== -1) {
      txs[idx].deleted = true; // Soft delete
      this.setStored(STORAGE_KEYS.TRANSACTIONS, txs);
    }
  }

  // --- Categories ---

  async getCategories(): Promise<Category[]> {
    await delay(300);
    return this.getStored<Category[]>(STORAGE_KEYS.CATEGORIES, [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES]);
  }

  async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
    await delay(300);
    const newCat: Category = { ...data, id: crypto.randomUUID() };
    const cats = await this.getCategories();
    cats.push(newCat);
    this.setStored(STORAGE_KEYS.CATEGORIES, cats);
    return newCat;
  }

  async deleteCategory(id: string): Promise<void> {
    await delay(300);
    let cats = await this.getCategories();
    cats = cats.filter(c => c.id !== id);
    this.setStored(STORAGE_KEYS.CATEGORIES, cats);
  }
}

export const api = new ApiService();
