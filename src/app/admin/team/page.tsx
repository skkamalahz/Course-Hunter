'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, RefreshCw, X, User, ArrowUp, ArrowDown, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    image_url?: string;
    category: string;
    order_index: number;
}

interface Category {
    id: string;
    name: string;
    order_index: number;
}

export default function AdminTeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        bio: '',
        image_url: '',
        category: 'Team'
    });

    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchCategories(), fetchMembers()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('team_categories')
            .select('*')
            .order('order_index', { ascending: true });
        if (error) throw error;
        setCategories(data || []);
        if (data && data.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: data[0].name }));
        }
    };

    const fetchMembers = async () => {
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .order('order_index', { ascending: true });
        if (error) throw error;
        setMembers(data || []);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `team-photos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('team-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('team-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please ensure the bucket exists and is public.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('team_members')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('team_members')
                    .insert([{ ...formData, order_index: members.length }]);
                if (error) throw error;
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', role: '', bio: '', image_url: '', category: categories[0]?.name || 'Team' });
            fetchMembers();
        } catch (error) {
            console.error('Error saving member:', error);
            alert('Error saving member: ' + (error as any).message);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const { error } = await supabase
                .from('team_categories')
                .insert([{ name: newCategoryName.trim(), order_index: categories.length }]);
            if (error) throw error;
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Category might already exist.');
        }
    };

    const handleRemoveCategory = async (id: string) => {
        if (!confirm('Are you sure? Removing a category will not delete members, but they will become uncategorized.')) return;
        try {
            const { error } = await supabase.from('team_categories').delete().eq('id', id);
            if (error) throw error;
            fetchCategories();
        } catch (error) {
            console.error('Error removing category:', error);
        }
    };

    const handleMoveCategory = async (id: string, direction: 'up' | 'down') => {
        const index = categories.findIndex(c => c.id === id);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === categories.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const target = categories[newIndex];
        const current = categories[index];

        try {
            await Promise.all([
                supabase.from('team_categories').update({ order_index: target.order_index }).eq('id', current.id),
                supabase.from('team_categories').update({ order_index: current.order_index }).eq('id', target.id)
            ]);
            fetchCategories();
        } catch (error) {
            console.error('Error reordering categories:', error);
        }
    };

    const handleEdit = (member: TeamMember) => {
        setEditingId(member.id);
        setFormData(member);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this member?')) return;
        try {
            const { error } = await supabase.from('team_members').delete().eq('id', id);
            if (error) throw error;
            fetchMembers();
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    const groupedMembers = categories.reduce((acc, cat) => {
        acc[cat.name] = members.filter(m => m.category === cat.name);
        return acc;
    }, {} as Record<string, TeamMember[]>);

    // Add members that don't belong to any existing category
    const uncategorized = members.filter(m => !categories.some(c => c.name === m.category));
    if (uncategorized.length > 0) {
        groupedMembers['Uncategorized'] = uncategorized;
    }

    if (loading) return <div className="flex justify-center p-20"><RefreshCw className="animate-spin text-primary-600" size={48} /></div>;

    return (
        <div className="p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Team Management</h1>
                    <p className="text-gray-600">Admin panel for team members and categories</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowCategoryManager(!showCategoryManager)}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center space-x-2"
                    >
                        <Save size={20} />
                        <span>Manage Categories</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditingId(null);
                            setFormData({ name: '', role: '', bio: '', image_url: '', category: categories[0]?.name || 'Team' });
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Add Member</span>
                    </button>
                </div>
            </div>

            {showCategoryManager && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Category Manager</h2>
                        <button onClick={() => setShowCategoryManager(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                            onClick={handleAddCategory}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {categories.map((cat, idx) => (
                            <div key={cat.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                <span className="font-medium">{cat.name}</span>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <button onClick={() => handleMoveCategory(cat.id, 'up')} disabled={idx === 0} className="hover:text-primary-600 disabled:opacity-30"><ArrowUp size={18} /></button>
                                    <button onClick={() => handleMoveCategory(cat.id, 'down')} disabled={idx === categories.length - 1} className="hover:text-primary-600 disabled:opacity-30"><ArrowDown size={18} /></button>
                                    <button onClick={() => handleRemoveCategory(cat.id)} className="hover:text-red-600 ml-4"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-primary-100"
                >
                    <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Member' : 'Add New Member'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                                <div className="flex items-center space-x-4">
                                    <div className="relative group w-12 h-12 flex-shrink-0">
                                        {formData.image_url ? (
                                            <img src={formData.image_url} className="w-full h-full object-cover rounded-lg border border-gray-200" alt="Preview" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <label className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all group">
                                        <div className="flex items-center space-x-2 text-gray-500 group-hover:text-primary-600">
                                            {uploading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
                                            <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full mt-2 px-3 py-1 text-xs border border-gray-200 rounded outline-none"
                                    placeholder="Or paste image URL here..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                required
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all"
                                disabled={uploading}
                            >
                                {editingId ? 'Update Member' : 'Save Member'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="space-y-12">
                {Object.entries(groupedMembers).map(([catName, catMembers]) => (
                    <div key={catName} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">{catName}</h2>
                            <span className="px-3 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                                {catMembers.length} MEMBERS
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {catMembers.map((member) => (
                                <motion.div
                                    layout
                                    key={member.id}
                                    className="bg-white rounded-2xl shadow-lg p-6 flex flex-col group hover:shadow-2xl transition-all border border-transparent hover:border-primary-100"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-primary-50 group-hover:border-primary-200 transition-all">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="text-gray-300" size={32} />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold group-hover:text-primary-700 transition-colors">{member.name}</h3>
                                                <p className="text-primary-600 font-bold text-xs uppercase tracking-widest">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(member)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{member.bio}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
