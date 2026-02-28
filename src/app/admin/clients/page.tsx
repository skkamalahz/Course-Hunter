'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, RefreshCw, X, Building2, ExternalLink, Upload, Image as ImageIcon } from 'lucide-react';
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
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Partial<Client>>({
        name: '',
        logo_url: '',
        website_url: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `client-${Math.random()}.${fileExt}`;
            const filePath = `client-logos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('team-images') // Using the same bucket we created for team photos
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('team-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, logo_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please check your connection.');
        } finally {
            setUploading(false);
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
                    <p className="text-gray-600">Showcase your trusted partners with logos</p>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client Logo</label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {formData.logo_url ? (
                                            <img src={formData.logo_url} className="w-full h-full object-contain p-1" alt="Logo Preview" />
                                        ) : (
                                            <ImageIcon className="text-gray-300" size={24} />
                                        )}
                                    </div>
                                    <label className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all group">
                                        <div className="flex items-center space-x-2 text-gray-500 group-hover:text-primary-600">
                                            {uploading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
                                            <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                </div>
                                <input
                                    type="hidden"
                                    value={formData.logo_url}
                                    required
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
                        <div className="flex space-x-4 pt-4 border-t border-gray-50">
                            <button
                                type="submit"
                                className="px-8 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all font-bold"
                                disabled={uploading}
                            >
                                {editingId ? 'Update Client' : 'Save Client'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-8 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {clients.map((client) => (
                    <motion.div
                        key={client.id}
                        layout
                        className="bg-white rounded-2xl shadow-lg p-8 group hover:shadow-2xl transition-all border border-transparent hover:border-primary-50 flex flex-col items-center text-center relative"
                    >
                        <div className="w-24 h-24 mb-6 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                            {client.logo_url ? (
                                <img src={client.logo_url} alt={client.name} className="max-w-full max-h-full object-contain p-4 transition-all group-hover:grayscale-0" />
                            ) : (
                                <Building2 className="text-gray-300" size={40} />
                            )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-700 transition-colors uppercase tracking-tight">{client.name}</h3>
                        {client.website_url && (
                            <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-xs font-bold flex items-center space-x-1 hover:underline mb-6 uppercase tracking-widest">
                                <span>Visit Site</span>
                                <ExternalLink size={12} />
                            </a>
                        )}
                        <div className="flex space-x-3 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(client)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
