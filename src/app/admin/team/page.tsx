'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, RefreshCw, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    order_index: number;
}

export default function AdminTeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        order_index: 0
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching team members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingMember) {
                const { error } = await supabase
                    .from('team_members')
                    .update(formData)
                    .eq('id', editingMember.id);
                if (error) throw error;
                alert('Member updated successfully!');
            } else {
                const { error } = await supabase
                    .from('team_members')
                    .insert([{ ...formData, order_index: members.length + 1 }]);
                if (error) throw error;
                alert('Member added successfully!');
            }
            setShowForm(false);
            setEditingMember(null);
            setFormData({ name: '', role: '', bio: '', order_index: 0 });
            fetchMembers();
        } catch (error) {
            console.error('Error saving team member:', error);
            alert('Failed to save member');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio,
            order_index: member.order_index
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setMembers(members.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting team member:', error);
            alert('Failed to delete member');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Team Management
                    </h1>
                    <p className="text-gray-600">Manage your team members</p>
                </div>
                <button
                    onClick={() => {
                        setEditingMember(null);
                        setFormData({ name: '', role: '', bio: '', order_index: 0 });
                        setShowForm(!showForm);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center space-x-2"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    <span>{showForm ? 'Close Form' : 'Add Member'}</span>
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-xl bg-white/60 border border-white/40 p-8 rounded-3xl shadow-xl mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6">{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                placeholder="Member's full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                            <input
                                type="text"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                placeholder="Job title"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                placeholder="Describe the member's background and expertise"
                            />
                        </div>
                        <div className="md:col-span-2 flex space-x-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center space-x-2 disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                <span>{saving ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl shadow-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-white/40 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-gray-800">{member.name}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-primary-600 font-medium">{member.role}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleEdit(member)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-50"
                                            title="Edit Member"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-50"
                                            title="Delete Member"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {members.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No team members found. Add your first member above!
                    </div>
                )}
            </div>
        </div>
    );
}
