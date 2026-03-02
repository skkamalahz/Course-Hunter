'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Briefcase } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    description: string;
    image_url: string;
    client: string;
    link?: string;
}

export default function OurWorkPage() {
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_items')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setPortfolio(data || []);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...Array.from(new Set(portfolio.map(item => item.category)))];

    const filteredWork = selectedCategory === 'All'
        ? portfolio
        : portfolio.filter(item => item.category === selectedCategory);

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
            <div className="min-h-screen pt-20">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                        >
                            Our Work
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Explore our portfolio of successful projects and campaigns
                        </motion.p>
                    </div>
                </section>

                {/* Filter Tabs */}
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center gap-4">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portfolio Grid */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredWork.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {filteredWork.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                        >
                                            <div className="relative aspect-video bg-gradient-to-br from-primary-200 to-accent-200 overflow-hidden">
                                                {project.image_url ? (
                                                    <img
                                                        src={project.image_url}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full opacity-50"></div>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                                    <a
                                                        href={project.link || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 bg-white rounded-full"
                                                    >
                                                        <ExternalLink className="text-primary-600" size={24} />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                                                        {project.category}
                                                    </span>
                                                    {project.client && (
                                                        <span className="text-xs text-gray-400 italic">Client: {project.client}</span>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                                <p className="text-gray-600">{project.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500 text-lg">Our portfolio is being updated. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
