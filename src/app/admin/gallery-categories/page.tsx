'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, RefreshCw, X, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    name: string;
    order_index: number;
}

export default function GalleryCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('gallery_categories')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        const newName = prompt('Enter category name:');
        if (!newName) return;

        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('gallery_categories')
                .insert([{
                    name: newName,
                    order_index: categories.length + 1
                }])
                .select()
                .single();

            if (error) throw error;
            setCategories([...categories, data]);
        } catch (error: any) {
            alert(error.message || 'Error adding category');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setEditName(category.name);
    };

    const handleSave = async (id: string) => {
        if (!editName.trim()) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('gallery_categories')
                .update({ name: editName })
                .eq('id', id);

            if (error) throw error;
            setCategories(categories.map(c => c.id === id ? { ...c, name: editName } : c));
            setEditingId(null);
        } catch (error: any) {
            alert(error.message || 'Error updating category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? Items using this category will still exist but might not filter correctly.`)) return;

        try {
            const { error } = await supabase
                .from('gallery_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCategories(categories.filter(c => c.id !== id));
        } catch (error: any) {
            alert(error.message || 'Error deleting category');
        }
    };

    const moveCategory = async (index: number, direction: 'up' | 'down') => {
        const newCategories = [...categories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newCategories.length) return;

        // Swap local State
        [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];

        // Update local state for immediate feedback
        setCategories(newCategories);

        // Update database positions
        try {
            const updates = newCategories.map((cat, i) => ({
                id: cat.id,
                order_index: i + 1
            }));

            // Use upsert with explicit onConflict to ensure it only updates positions
            const { error } = await supabase
                .from('gallery_categories')
                .upsert(updates, { onConflict: 'id' });

            if (error) throw error;
        } catch (error: any) {
            console.error('Error reordering:', error);
            alert('Failed to save the new order: ' + (error.message || 'Unknown error'));
            fetchCategories(); // Rollback to database state
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gallery Categories</h1>
                    <p className="text-gray-500">Add and arrange categories for your gallery</p>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={saving}
                    className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary-200"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-50">
                    <AnimatePresence mode="popLayout">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveCategory(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-primary-600 disabled:opacity-30 transition-colors"
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => moveCategory(index, 'down')}
                                            disabled={index === categories.length - 1}
                                            className="p-1 text-gray-400 hover:text-primary-600 disabled:opacity-30 transition-colors"
                                        >
                                            <ArrowDown size={14} />
                                        </button>
                                    </div>

                                    {editingId === category.id ? (
                                        <div className="flex items-center gap-2 flex-1 max-w-md">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-primary-200 outline-none focus:ring-2 ring-primary-50"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleSave(category.id)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <Save size={18} />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                                            {category.name}
                                        </h3>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-300 mr-4 tabular-nums">#{index + 1}</span>
                                    {!editingId && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {categories.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Plus size={32} />
                        </div>
                        <p className="text-gray-500">No categories yet. Add your first one above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
