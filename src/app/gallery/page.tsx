'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import { X, ZoomIn, ArrowLeft, ArrowRight, Play, Film, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/common/PageHeader';

interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    video_src?: string;
    title: string;
    category: string;
    description: string;
}

interface Category {
    id: string;
    name: string;
}

export default function GalleryPage() {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchGallery(),
                fetchCategories()
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_categories')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchGallery = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_items')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setGalleryItems(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        }
    };

    const filteredItems = selectedCategory === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === selectedCategory);

    const openLightbox = (item: GalleryItem, index: number) => {
        setSelectedItem(item);
        setCurrentIndex(index);
    };

    const closeLightbox = () => {
        setSelectedItem(null);
    };

    const navigateItem = (direction: 'prev' | 'next') => {
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % filteredItems.length
            : (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        setCurrentIndex(newIndex);
        setSelectedItem(filteredItems[newIndex]);
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <RefreshCw className="animate-spin text-primary-600" size={48} />
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 relative overflow-hidden">
                <PageHeader pagePath="/gallery" />

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap justify-center gap-4 mb-16"
                    >
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 ${selectedCategory === 'All'
                                ? 'bg-primary-900 text-white shadow-xl'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 ${selectedCategory === category.name
                                    ? 'bg-primary-900 text-white shadow-xl'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </motion.div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -10 }}
                                    className="group relative cursor-pointer"
                                    onClick={() => openLightbox(item, index)}
                                >
                                    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={item.src}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {item.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                                        <Play className="text-white fill-white ml-1" size={32} />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <ZoomIn className="text-white mx-auto mb-2" size={32} />
                                                    <p className="text-white text-xs font-bold uppercase tracking-widest">View {item.type}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <span className="text-primary-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 block">{item.category}</span>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{item.title}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-2 italic">{item.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" onClick={closeLightbox}>
                            <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50" onClick={closeLightbox}>
                                <X size={24} />
                            </button>

                            <button className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50" onClick={(e) => { e.stopPropagation(); navigateItem('prev'); }}>
                                <ArrowLeft size={24} />
                            </button>

                            <button className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50" onClick={(e) => { e.stopPropagation(); navigateItem('next'); }}>
                                <ArrowRight size={24} />
                            </button>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative max-w-6xl w-full bg-transparent rounded-3xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="relative aspect-video flex items-center justify-center bg-black/40 rounded-3xl overflow-hidden border border-white/10">
                                    {selectedItem.type === 'video' ? (
                                        <video controls autoPlay className="max-w-full max-h-full object-contain">
                                            <source src={selectedItem.video_src || selectedItem.src} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img src={selectedItem.src} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
                                    )}
                                </div>
                                <div className="mt-6 text-center text-white">
                                    <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide">{selectedItem.title}</h3>
                                    <p className="text-gray-400 italic">{selectedItem.description}</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </PublicLayout>
    );
}
