import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Transaction, Category } from '../types';
import { Card, Button, Input, Select, Modal } from '../components/UI';
import { Search, Plus, Edit2, Trash2, Filter, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredTxs, setFilteredTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
      amount: '',
      type: 'expense',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    if (searchParams.get('action') === 'new') {
        openModal();
    }
  }, []);

  useEffect(() => {
    let result = transactions;
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(t => 
            t.categoryName.toLowerCase().includes(lower) || 
            (t.notes && t.notes.toLowerCase().includes(lower)) ||
            t.amount.toString().includes(lower)
        );
    }
    setFilteredTxs(result);
  }, [searchTerm, transactions]);

  const loadData = async () => {
    try {
        const [txs, cats] = await Promise.all([
            api.getTransactions(),
            api.getCategories()
        ]);
        setTransactions(txs);
        setCategories(cats);
    } catch (error) {
        console.error("Failed to load data", error);
    } finally {
        setLoading(false);
    }
  };

  const openModal = (tx?: Transaction) => {
    if (tx) {
        setEditingTx(tx);
        setFormData({
            amount: tx.amount.toString(),
            type: tx.type,
            categoryId: tx.categoryId,
            date: tx.date,
            notes: tx.notes || ''
        });
    } else {
        setEditingTx(null);
        setFormData({
            amount: '',
            type: 'expense',
            categoryId: categories[0]?.id || '',
            date: new Date().toISOString().split('T')[0],
            notes: ''
        });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const category = categories.find(c => c.id === formData.categoryId);
        
        const payload = {
            amount: parseFloat(formData.amount),
            type: formData.type as 'income' | 'expense',
            categoryId: formData.categoryId,
            categoryName: category?.name || 'Unknown',
            currency: 'USD',
            date: formData.date,
            notes: formData.notes,
            userId: api.getCurrentUser()?.id || '',
        };

        if (editingTx) {
            await api.updateTransaction(editingTx.id, payload);
        } else {
            await api.createTransaction(payload);
        }

        await loadData();
        setIsModalOpen(false);
    } catch (error) {
        console.error("Error saving transaction", error);
        alert("Failed to save transaction.");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click events if added later
    
    if (window.confirm('Are you sure you want to delete this transaction?')) {
        setDeletingId(id);
        try {
            await api.deleteTransaction(id);
            // Optimistic update: Remove from UI immediately
            setTransactions(prev => prev.filter(t => t.id !== id));
            setFilteredTxs(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete transaction");
            loadData(); // Revert state on error
        } finally {
            setDeletingId(null);
        }
    }
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
            <Plus size={18} /> Add New
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ color: '#000', backgroundColor: '#fff' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Future: Add more filters here */}
            <Button variant="secondary" className="hidden sm:flex">
                <Filter size={18} /> Filter
            </Button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-100 text-sm font-medium text-gray-500">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Note</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {filteredTxs.map(tx => (
                        <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                            <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{tx.date}</td>
                            <td className="py-3 px-4 font-medium text-gray-800">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {tx.categoryName}
                            </td>
                            <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{tx.notes}</td>
                            <td className={`py-3 px-4 text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button 
                                        type="button"
                                        onClick={() => openModal(tx)} 
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDelete(tx.id, e)} 
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
                                        title="Delete"
                                        disabled={deletingId === tx.id}
                                    >
                                        {deletingId === tx.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredTxs.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-500">
                                No transactions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTx ? "Edit Transaction" : "Add Transaction"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select 
                    label="Type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    style={{ color: '#000', backgroundColor: '#fff' }}
                >
                    <option value="expense" className="text-gray-900 bg-white">Expense</option>
                    <option value="income" className="text-gray-900 bg-white">Income</option>
                </Select>
                <Input 
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    style={{ color: '#000', backgroundColor: '#fff' }}
                />
            </div>
            
            <Select 
                label="Category"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                required
                style={{ color: '#000', backgroundColor: '#fff' }}
            >
                <option value="" className="text-gray-500">Select Category</option>
                {filteredCategories.map(c => (
                    <option key={c.id} value={c.id} className="text-gray-900 bg-white">{c.name}</option>
                ))}
            </Select>

            <Input 
                label="Date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                style={{ color: '#000', backgroundColor: '#fff' }}
            />

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full bg-white text-gray-900"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    style={{ color: '#000', backgroundColor: '#fff' }}
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={loading}>{editingTx ? "Save Changes" : "Add Transaction"}</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};