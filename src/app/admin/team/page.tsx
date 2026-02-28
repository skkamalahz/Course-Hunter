'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, RefreshCw, X, User, ChevronDown, ChevronRight } from 'lucide-react';
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

const DEFAULT_CATEGORIES = ['Founder', 'Management', 'Marketing', 'Development', 'Design', 'Team'];

export default function AdminTeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        bio: '',
        image_url: '',
        category: 'Team'
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('order_index', { ascending: true });
            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
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
            setFormData({ name: '', role: '', bio: '', image_url: '', category: 'Team' });
            fetchMembers();
        } catch (error) {
            console.error('Error saving member:', error);
            alert('Error saving member: ' + (error as any).message);
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

    const groupedMembers = members.reduce((acc, member) => {
        const cat = member.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(member);
        return acc;
    }, {} as Record<string, TeamMember[]>);

    if (loading) return <div className="flex justify-center p-20"><RefreshCw className="animate-spin text-primary-600" size={48} /></div>;

    return (
        <div className="p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Team Management</h1>
                    <p className="text-gray-600">Manage your founders and team members by category</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ name: '', role: '', bio: '', image_url: '', category: 'Team' });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add Member</span>
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-lg mb-8"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role (e.g., SEO Specialist)</label>
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
                                    {DEFAULT_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    {!DEFAULT_CATEGORIES.includes(formData.category || '') && formData.category && (
                                        <option value={formData.category}>{formData.category}</option>
                                    )}
                                </select>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="Or type custom category..."
                                        className="w-full px-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        onBlur={(e) => {
                                            if (e.target.value.trim()) {
                                                setFormData({ ...formData, category: e.target.value.trim() });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="https://example.com/photo.jpg"
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
                            >
                                {editingId ? 'Update' : 'Save'}
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
                {Object.entries(groupedMembers).map(([category, members]) => (
                    <div key={category} className="space-y-4">
                        <div className="flex items-center space-x-4 border-b border-gray-200 pb-2">
                            <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                {members.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {members.map((member) => (
                                <div key={member.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col group hover:shadow-xl transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-primary-100">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="text-gray-300" size={32} />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{member.name}</h3>
                                                <p className="text-primary-600 font-medium text-sm">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
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
                                    <p className="text-gray-700 text-sm line-clamp-3">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
