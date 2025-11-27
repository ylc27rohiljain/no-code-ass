import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Category } from '../types';
import { Card, Button, Input, Modal, Select } from '../components/UI';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'expense', color: '#000000' });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await api.getCategories();
    setCategories(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createCategory({
        name: formData.name,
        type: formData.type as any,
        color: formData.color,
        userId: api.getCurrentUser()?.id
    });
    setFormData({ name: '', type: 'expense', color: '#000000' }); // Reset form
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('Delete category?')) {
        setDeletingId(id);
        try {
            await api.deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error(error);
            loadData();
        } finally {
            setDeletingId(null);
        }
    }
  }

  const CategoryList = ({ title, type }: { title: string, type: string }) => (
    <div className="flex-1">
        <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="space-y-3">
            {categories.filter(c => c.type === type).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c.color }}>
                            {c.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{c.name}</span>
                    </div>
                    {!c.isDefault && (
                        <button 
                            onClick={(e) => handleDelete(c.id, e)} 
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={deletingId === c.id}
                            title="Delete Category"
                        >
                             {deletingId === c.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                    )}
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Add Category</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <CategoryList title="Income Categories" type="income" />
        <CategoryList title="Expense Categories" type="expense" />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Category">
        <form onSubmit={handleCreate} className="space-y-4">
            <Input 
                label="Name" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Online Subscriptions"
                style={{ color: '#000', backgroundColor: '#fff' }}
            />
            <Select 
                label="Type" 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                style={{ color: '#000', backgroundColor: '#fff' }}
            >
                <option value="income" className="text-gray-900 bg-white">Income</option>
                <option value="expense" className="text-gray-900 bg-white">Expense</option>
            </Select>
            <div className="flex flex-col gap-1 text-left">
                <label className="text-sm font-medium text-gray-700">Color</label>
                <div className="flex items-center gap-3">
                    <input 
                        type="color" 
                        className="w-12 h-10 rounded cursor-pointer border border-gray-200 p-1" 
                        value={formData.color} 
                        onChange={e => setFormData({...formData, color: e.target.value})} 
                    />
                    <span className="text-sm text-gray-500">{formData.color}</span>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit">Create Category</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};