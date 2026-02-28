'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import workData from '@/data/work.json';
import { ExternalLink } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

const categories = ['All', ...Array.from(new Set(workData.map(item => item.category)))];

export default function OurWorkPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredWork = selectedCategory === 'All'
        ? workData
        : workData.filter(item => item.category === selectedCategory);

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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full opacity-50"></div>
                                        </div>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                            <a
                                                href={project.link}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 bg-white rounded-full"
                                            >
                                                <ExternalLink className="text-primary-600" size={24} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-3">
                                            {project.category}
                                        </span>
                                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                        <p className="text-gray-600">{project.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
