'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit, RefreshCw, Upload, Image as ImageIcon, Palette, Layout } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PageHeader {
    id: string;
    page_path: string;
    title: string;
    subtitle: string;
    bg_type: string;
    bg_value: string;
    text_color: string;
    header_height: string;
}

export default function PageHeadersManagement() {
    const [headers, setHeaders] = useState<PageHeader[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingHeader, setEditingHeader] = useState<PageHeader | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchHeaders();
    }, []);

    const fetchHeaders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('page_headers')
                .select('*')
                .order('page_path');

            if (error) throw error;
            setHeaders(data || []);
        } catch (error) {
            console.error('Error fetching headers:', error);
            alert('Failed to load headers');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingHeader) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('page_headers')
                .update({
                    title: editingHeader.title,
                    subtitle: editingHeader.subtitle,
                    bg_type: editingHeader.bg_type,
                    bg_value: editingHeader.bg_value,
                    text_color: editingHeader.text_color,
                    header_height: editingHeader.header_height,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingHeader.id);

            if (error) throw error;
            alert('Header updated successfully!');
            setEditingHeader(null);
            fetchHeaders();
        } catch (error) {
            console.error('Error saving header:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingHeader) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `header-photos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('service-images') // Reuse existing bucket
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('service-images')
                .getPublicUrl(filePath);

            setEditingHeader({ ...editingHeader, bg_value: publicUrl, bg_type: 'image' });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><RefreshCw className="animate-spin" /></div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Page Headers</h1>
                <p className="text-gray-600">Customize headers for different pages of your website</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {headers.map((header) => (
                    <div
                        key={header.id}
                        className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => setEditingHeader(header)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold uppercase tracking-tight">{header.page_path.replace('/', '') || 'Home'}</h3>
                            <Edit size={18} className="text-gray-400 group-hover:text-primary-600" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-serif text-lg line-clamp-1">{header.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{header.subtitle}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-100 rounded-full">{header.bg_type}</span>
                            <div className={`w-4 h-4 rounded-full border border-gray-100 ${header.bg_type === 'gradient' ? `bg-gradient-to-r ${header.bg_value}` : ''}`}
                                style={header.bg_type === 'color' ? { backgroundColor: header.bg_value } : header.bg_type === 'image' ? { backgroundImage: `url(${header.bg_value})`, backgroundSize: 'cover' } : {}}>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingHeader && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold">Edit Header: {editingHeader.page_path}</h2>
                            <button onClick={() => setEditingHeader(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <Layout size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold uppercase mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingHeader.title}
                                    onChange={(e) => setEditingHeader({ ...editingHeader, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase mb-2">Subtitle</label>
                                <textarea
                                    value={editingHeader.subtitle}
                                    onChange={(e) => setEditingHeader({ ...editingHeader, subtitle: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold uppercase mb-2">Background Type</label>
                                    <select
                                        value={editingHeader.bg_type}
                                        onChange={(e) => setEditingHeader({ ...editingHeader, bg_type: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                    >
                                        <option value="gradient">Gradient (Tailwind)</option>
                                        <option value="color">Solid Color</option>
                                        <option value="image">Image</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase mb-2">Height</label>
                                    <select
                                        value={editingHeader.header_height}
                                        onChange={(e) => setEditingHeader({ ...editingHeader, header_height: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                    >
                                        <option value="py-12">Small (py-12)</option>
                                        <option value="py-20">Medium (py-20)</option>
                                        <option value="py-32">Large (py-32)</option>
                                        <option value="py-40">Extra Large (py-40)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase mb-2">Background Style (Hex/Gradient/URL)</label>
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="text"
                                        value={editingHeader.bg_value}
                                        onChange={(e) => setEditingHeader({ ...editingHeader, bg_value: e.target.value })}
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                        placeholder={editingHeader.bg_type === 'gradient' ? 'from-primary-50 to-white' : '#ffffff'}
                                    />
                                    {editingHeader.bg_type === 'image' && (
                                        <label className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer flex items-center transition-colors">
                                            <Upload size={18} className="mr-2" />
                                            <span className="text-sm font-bold">{uploading ? '...' : 'Upload'}</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => setEditingHeader(null)}
                                    className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
