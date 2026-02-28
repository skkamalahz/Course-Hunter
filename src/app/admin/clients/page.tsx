'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react';

export default function ClientsManagementPage() {
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<string[]>([]);
    const [newClient, setNewClient] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/admin/clients');
            const data = await res.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await fetch('/api/admin/clients', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clients)
            });
            alert('Clients updated successfully!');
        } catch (error) {
            console.error('Error saving clients:', error);
            alert('Failed to save changes');
        }
    };

    const handleAdd = () => {
        if (newClient.trim()) {
            setClients([...clients, newClient.trim()]);
            setNewClient('');
        }
    };

    const handleDelete = (index: number) => {
        setClients(clients.filter((_, i) => i !== index));
    };

    const handleUpdate = (index: number, value: string) => {
        const updated = [...clients];
        updated[index] = value;
        setClients(updated);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Clients Management
                </h1>
                <p className="text-gray-600">Manage your client list</p>
            </div>

            {/* Add New Client */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-2xl p-6 shadow-lg mb-6"
            >
                <h2 className="text-lg font-semibold mb-4">Add New Client</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newClient}
                        onChange={(e) => setNewClient(e.target.value)}
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

            {/* Clients List */}
            <div className="space-y-3 mb-6">
                {clients.map((client, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-xl p-4 shadow-lg flex items-center space-x-3"
                    >
                        <input
                            type="text"
                            value={client}
                            onChange={(e) => handleUpdate(index, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 outline-none"
                        />
                        <button
                            onClick={() => handleDelete(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={handleSave}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
                <Save size={20} />
                <span>Save All Changes</span>
            </button>
        </div>
    );
}
