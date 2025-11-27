import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Transaction } from '../types';
import { Card, Button } from '../components/UI';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await api.getTransactions();
    setTransactions(data);
    setLoading(false);
  };

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthTxs = transactions.filter(t => t.date.startsWith(currentMonth));
  
  const income = monthTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  const data = [
    { name: 'Income', value: income, color: '#00BFA5' },
    { name: 'Expense', value: expense, color: '#EF5350' },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500">Overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/transactions')}>View All</Button>
            <Button onClick={() => navigate('/transactions?action=new')}>+ Add Transaction</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 border-l-4 border-l-primary-500">
          <div className="p-3 bg-primary-50 rounded-full text-primary-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Balance</p>
            <p className="text-2xl font-bold text-gray-800">${balance.toFixed(2)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Income</p>
            <p className="text-2xl font-bold text-green-600">+${income.toFixed(2)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-50 rounded-full text-red-600">
            <ArrowDownRight size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Expenses</p>
            <p className="text-2xl font-bold text-red-600">-${expense.toFixed(2)}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
            <Card title="Recent Transactions" className="h-full">
                {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No transactions found.</p>
                ) : (
                    <div className="space-y-4">
                        {transactions.slice(0, 5).map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <DollarSign size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{tx.categoryName}</p>
                                        <p className="text-xs text-gray-500">{tx.date} • {tx.notes || 'No notes'}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>

        {/* Chart */}
        <div className="lg:col-span-1">
            <Card title="Income vs Expense" className="h-full flex flex-col">
                <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent-500" />
                        <span>Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Expense</span>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};
