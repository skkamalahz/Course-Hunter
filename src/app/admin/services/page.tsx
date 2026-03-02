'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, RefreshCw, Upload } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Service {
    id: string;
    title: string;
    description: string;
    detailed_description: string;
    icon: string;
    image_url: string;
    order_index: number;
}

export default function ServicesManagementPage() {
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Service | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (service: Service) => {
        setSaving(true);
        try {
            if (service.id.length > 20) { // Existing UUID
                const { error } = await supabase
                    .from('services')
                    .update({
                        title: service.title,
                        description: service.description,
                        detailed_description: service.detailed_description,
                        icon: service.icon,
                        image_url: service.image_url,
                        order_index: service.order_index
                    })
                    .eq('id', service.id);
                if (error) throw error;
            } else { // New service (temporary ID)
                const { error } = await supabase
                    .from('services')
                    .insert([{
                        title: service.title,
                        description: service.description,
                        detailed_description: service.detailed_description,
                        icon: service.icon,
                        image_url: service.image_url,
                        order_index: service.order_index
                    }]);
                if (error) throw error;
            }
            alert('Service saved successfully!');
            fetchServices();
            setEditingId(null);
            setEditForm(null);
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editForm) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `service-photos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('service-images')
                .upload(filePath, file, {
                    contentType: file.type === 'image/webp' ? 'image/webp' : undefined
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('service-images')
                .getPublicUrl(filePath);

            setEditForm({ ...editForm, image_url: publicUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setEditForm({ ...service });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service');
        }
    };

    const handleAdd = () => {
        const newService: Service = {
            id: Date.now().toString(),
            title: 'New Service',
            description: 'Service summary',
            detailed_description: 'Detailed service description for the section...',
            icon: 'Briefcase',
            image_url: '',
            order_index: services.length + 1
        };
        setEditingId(newService.id);
        setEditForm(newService);
        setServices([newService, ...services]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Services Management
                    </h1>
                    <p className="text-gray-600">Manage your service offerings</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add Service</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-2xl p-6 shadow-lg"
                    >
                        {editingId === service.id && editForm ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 outline-none"
                                        placeholder="Service Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 outline-none"
                                        rows={3}
                                        placeholder="Service Description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Detailed Description (for Section)</label>
                                    <textarea
                                        value={editForm.detailed_description}
                                        onChange={(e) => setEditForm({ ...editForm, detailed_description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 outline-none"
                                        rows={5}
                                        placeholder="Briefly describe the service in detail for its own section..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Icon Name</label>
                                        <input
                                            type="text"
                                            value={editForm.icon}
                                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 outline-none"
                                            placeholder="Icon Name (e.g., Search, Target)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service Image</label>
                                        <div className="flex items-center space-x-2">
                                            <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <Icons.Upload size={18} className="mr-2 text-gray-500" />
                                                <span className="text-sm text-gray-600 truncate">
                                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                                </span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*,.webp"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                />
                                            </label>
                                            {editForm.image_url && (
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={editForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 pt-2">
                                    <button
                                        onClick={() => handleSave(editForm)}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <Save size={18} />
                                        <span>{saving ? 'Saving...' : 'Save'}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditForm(null);
                                            if (service.id.length < 20) setServices(services.filter(s => s.id !== service.id));
                                        }}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-bold uppercase">
                                            Icon: {service.icon}
                                        </div>
                                        {service.image_url && (
                                            <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase">
                                                Image Attached
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {service.image_url && (
                                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 ml-4 hidden sm:block">
                                        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex flex-col space-y-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                                        title="Edit Service"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                        title="Delete Service"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
