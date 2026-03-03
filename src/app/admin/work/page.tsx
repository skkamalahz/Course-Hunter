'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, RefreshCw, X, Link as LinkIcon, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    image_url: string;
    client: string;
    link: string;
    order_index: number;
}

export default function AdminWorkPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        category: 'Web Development',
        description: '',
        image_url: '',
        client: '',
        link: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_items')
                .select('*')
                .order('order_index', { ascending: true });
            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
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
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `portfolio-photos/${fileName}`;

            // Use 'gallery-images' bucket as it's already established for photos
            const { error: uploadError } = await supabase.storage
                .from('gallery-images')
                .upload(filePath, file, {
                    contentType: file.type || 'image/webp'
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('gallery-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + (error.message || 'Check storage permissions.'));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Destructure to remove 'id' if it exists in formData
            const { id, ...saveData } = formData as any;

            if (editingId) {
                const { error } = await supabase
                    .from('portfolio_items')
                    .update(saveData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('portfolio_items')
                    .insert([{ ...saveData, order_index: projects.length }]);
                if (error) throw error;
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', category: 'Web Development', description: '', image_url: '', client: '', link: '' });
            fetchProjects();
        } catch (error: any) {
            console.error('Error saving project:', error);
            alert('Error saving project: ' + (error.message || 'Check database constraints.'));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setFormData(project);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
            if (error) throw error;
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><RefreshCw className="animate-spin text-primary-600" size={48} /></div>;

    return (
        <div className="p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Portfolio Management</h1>
                    <p className="text-gray-600">Manage your portfolio projects</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ title: '', category: 'Web Development', description: '', image_url: '', client: '', link: '' });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add Project</span>
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-lg mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                <option>Web Development</option>
                                <option>Branding</option>
                                <option>Digital Marketing</option>
                                <option>Social Media</option>
                                <option>UI/UX Design</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                            <div className="flex items-center space-x-4 mb-3">
                                <div className="relative group w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                    {formData.image_url ? (
                                        <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700">
                                        {uploading ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                                        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*,.webp"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Or paste direct image URL..."
                                        value={formData.image_url || ''}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                            <input
                                type="text"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                            <input
                                type="url"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2 flex space-x-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 group">
                        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                            {project.image_url ? (
                                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                                    <LinkIcon className="text-primary-300" size={32} />
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{project.category}</span>
                            <h3 className="font-bold text-lg">{project.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(project)}
                                className="flex-1 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Edit2 size={16} />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="flex-1 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Trash2 size={16} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
