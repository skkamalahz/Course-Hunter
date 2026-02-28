'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, RefreshCw, Film, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface GalleryItem {
    id: string;
    type: string;
    src: string;
    video_src?: string | null;
    title: string;
    category: string;
    description: string;
    order_index: number;
}

export default function GalleryManagementPage() {
    const [loading, setLoading] = useState(true);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<GalleryItem | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('gallery_items')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setGallery(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (item: GalleryItem) => {
        setSaving(true);
        try {
            const dataToSave = {
                type: item.type,
                src: item.src,
                video_src: item.video_src,
                title: item.title,
                category: item.category,
                description: item.description,
                order_index: item.order_index
            };

            if (item.id.length > 20) { // Existing UUID
                const { error } = await supabase
                    .from('gallery_items')
                    .update(dataToSave)
                    .eq('id', item.id);
                if (error) throw error;
            } else { // New item
                const { error } = await supabase
                    .from('gallery_items')
                    .insert([dataToSave]);
                if (error) throw error;
            }
            alert('Item saved successfully!');
            fetchGallery();
            setEditingId(null);
            setEditForm(null);
        } catch (error) {
            console.error('Error saving gallery item:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item: GalleryItem) => {
        setEditingId(item.id);
        setEditForm({ ...item });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this gallery item?')) return;
        try {
            const { error } = await supabase
                .from('gallery_items')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setGallery(gallery.filter(g => g.id !== id));
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            alert('Failed to delete item');
        }
    };

    const handleAdd = () => {
        const newItem: GalleryItem = {
            id: Date.now().toString(),
            type: 'image',
            src: '/assets/all-images/5-1.png',
            title: 'New Gallery Item',
            category: 'Campaigns',
            description: 'Gallery item description',
            order_index: gallery.length + 1
        };
        setEditingId(newItem.id);
        setEditForm(newItem);
        setGallery([newItem, ...gallery]);
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
                        Gallery Management
                    </h1>
                    <p className="text-gray-600">Manage campaigns, culture photos, and videos</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add Item</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {gallery.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl overflow-hidden shadow-xl"
                    >
                        {editingId === item.id && editForm ? (
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                    <select
                                        value={editForm.type}
                                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                                    >
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                                        placeholder="Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                                    >
                                        <option value="Campaigns">Campaigns</option>
                                        <option value="Culture">Culture</option>
                                        <option value="Videos">Videos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                                        rows={2}
                                        placeholder="Description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Src Path</label>
                                    <input
                                        type="text"
                                        value={editForm.src}
                                        onChange={(e) => setEditForm({ ...editForm, src: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                                        placeholder="Image/Thumbnail Path"
                                    />
                                </div>
                                {editForm.type === 'video' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video Path</label>
                                        <input
                                            type="text"
                                            value={editForm.video_src || ''}
                                            onChange={(e) => setEditForm({ ...editForm, video_src: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                                            placeholder="Video Path"
                                        />
                                    </div>
                                )}
                                <div className="flex space-x-2 pt-2">
                                    <button
                                        onClick={() => handleSave(editForm)}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        <span>{saving ? 'Saving...' : 'Save'}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditForm(null);
                                            if (item.id.length < 20) setGallery(gallery.filter(g => g.id !== item.id));
                                        }}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="relative h-48 bg-gray-900 flex items-center justify-center">
                                    {item.type === 'video' ? (
                                        <Film className="text-primary-400" size={48} />
                                    ) : (
                                        <ImageIcon className="text-accent-400" size={48} />
                                    )}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                                        {item.type}
                                    </div>
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-lg mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                                        </div>
                                        <div className="flex flex-col space-y-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-50"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-50"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
