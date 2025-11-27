import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Transaction } from '../types';
import { Card } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const Reports: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.getTransactions().then(setTransactions);
    }, []);

    // Group transactions by month for the last 6 months
    const getMonthlyData = () => {
        const data: Record<string, { name: string, income: number, expense: number }> = {};
        const months = 6;
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toISOString().slice(0, 7);
            const label = d.toLocaleString('default', { month: 'short' });
            data[key] = { name: label, income: 0, expense: 0 };
        }

        transactions.forEach(t => {
            const key = t.date.slice(0, 7);
            if (data[key]) {
                if (t.type === 'income') data[key].income += t.amount;
                else data[key].expense += t.amount;
            }
        });

        return Object.values(data);
    };

    const chartData = getMonthlyData();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
            <Card title="Income vs Expense Trend">
                <div className="h-[400px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(val) => `$${val}`} />
                            <Tooltip 
                                cursor={{fill: '#F9FAFB'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="income" fill="#1E88E5" radius={[4, 4, 0, 0]} name="Income" />
                            <Bar dataKey="expense" fill="#EF5350" radius={[4, 4, 0, 0]} name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
