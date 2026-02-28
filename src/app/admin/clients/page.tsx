'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Client {
    id: string;
    name: string;
    logo_url?: string;
    order_index: number;
}

export default function ClientsManagementPage() {
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<Client[]>([]);
    const [newClientName, setNewClientName] = useState('');

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

    const handleAdd = async () => {
        if (!newClientName.trim()) return;
        try {
            const { data, error } = await supabase
                .from('clients')
                .insert([{ name: newClientName.trim(), order_index: clients.length }]);

            if (error) throw error;
            setNewClientName('');
            fetchClients();
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const { error } = await supabase.from('clients').delete().eq('id', id);
            if (error) throw error;
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const handleUpdateName = async (id: string, name: string) => {
        const updatedClients = clients.map(c => c.id === id ? { ...c, name } : c);
        setClients(updatedClients);
    };

    const saveChanges = async () => {
        try {
            // Update all clients sequentially or in a single transaction if supported properly by client,
            // but here we'll just save the ones that were edited. 
            // For simplicity, we'll just alert that names are saved locally and user should probably 
            // have a proper save per item or batch. Let's implement batch update.
            const updates = clients.map(client => ({
                id: client.id,
                name: client.name,
                order_index: client.order_index
            }));

            const { error } = await supabase.from('clients').upsert(updates);
            if (error) throw error;
            alert('All clients updated successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error saving changes');
        }
    };

    if (loading) return <div className="flex justify-center p-20"><RefreshCw className="animate-spin text-primary-600" size={48} /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Clients Management
                </h1>
                <p className="text-gray-600">Manage your client list for the homepage</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-2xl p-6 shadow-lg mb-6"
            >
                <h2 className="text-lg font-semibold mb-4">Add New Client</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        placeholder="Client Name"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Add</span>
                    </button>
                </div>
            </motion.div>

            <div className="space-y-3 mb-6">
                {clients.map((client, index) => (
                    <motion.div
                        key={client.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-xl p-4 shadow-lg flex items-center space-x-3"
                    >
                        <input
                            type="text"
                            value={client.name}
                            onChange={(e) => handleUpdateName(client.id, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 outline-none"
                        />
                        <button
                            onClick={() => handleDelete(client.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={saveChanges}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
                <Save size={20} />
                <span>Save All Changes</span>
            </button>
        </div>
    );
}
