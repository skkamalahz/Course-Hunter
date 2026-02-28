'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, RefreshCw, X, Building2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Client {
    id: string;
    name: string;
    logo_url?: string;
    website_url?: string;
    order_index: number;
}

export default function AdminClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Client>>({
        name: '',
        logo_url: '',
        website_url: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('order_index', { ascending: true });
            if (error) throw error;
            setClients(data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('clients')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('clients')
                    .insert([{ ...formData, order_index: clients.length }]);
                if (error) throw error;
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', logo_url: '', website_url: '' });
            fetchClients();
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Error saving client: ' + (error as any).message);
        }
    };

    const handleEdit = (client: Client) => {
        setEditingId(client.id);
        setFormData(client);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this client?')) return;
        try {
            const { error } = await supabase.from('clients').delete().eq('id', id);
            if (error) throw error;
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><RefreshCw className="animate-spin text-primary-600" size={48} /></div>;

    return (
        <div className="p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Client Management</h1>
                    <p className="text-gray-600">Manage your trusted partners and their logos</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ name: '', logo_url: '', website_url: '' });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add New Client</span>
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-primary-100"
                >
                    <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Client' : 'Add New Client'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                    placeholder="e.g. Google"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                                <input
                                    type="text"
                                    value={formData.logo_url}
                                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.website_url}
                                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="https://client-website.com"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all"
                            >
                                {editingId ? 'Update Client' : 'Save Client'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clients.map((client) => (
                    <motion.div
                        key={client.id}
                        layout
                        className="bg-white rounded-xl shadow-lg p-6 group hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 mb-4 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden">
                            {client.logo_url ? (
                                <img src={client.logo_url} alt={client.name} className="max-w-full max-h-full object-contain p-2" />
                            ) : (
                                <Building2 className="text-gray-300" size={32} />
                            )}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{client.name}</h3>
                        {client.website_url && (
                            <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-xs flex items-center space-x-1 hover:underline mb-4">
                                <span>Visit Website</span>
                                <ExternalLink size={12} />
                            </a>
                        )}
                        <div className="flex space-x-2 mt-auto">
                            <button
                                onClick={() => handleEdit(client)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
