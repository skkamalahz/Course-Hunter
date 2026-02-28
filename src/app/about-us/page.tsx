'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Zap, RefreshCw } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

const valueIcons = [Target, Eye, Heart, Zap];

interface AboutSettings {
    title: string;
    mission: string;
    vision: string;
    story: string;
    values: string[];
}

export default function AboutUsPage() {
    const [about, setAbout] = useState<AboutSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const { data, error } = await supabase
                .from('about_settings')
                .select('*')
                .eq('id', 'about_001')
                .single();

            if (error) throw error;
            setAbout(data);
        } catch (error) {
            console.error('Error fetching about data:', error);
        } finally {
            setLoading(false);
        }
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

    if (!about) return null;

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
                            About Us
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            {about.title}
                        </motion.p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 bg-gradient-to-br from-primary-50 to-white rounded-2xl border-2 border-primary-100"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                                    <Target className="text-white" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {about.mission}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 bg-gradient-to-br from-accent-50 to-white rounded-2xl border-2 border-accent-100"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                                    <Eye className="text-white" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {about.vision}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold text-center mb-16"
                        >
                            Our Values
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {about.values.map((value, index) => {
                                const Icon = valueIcons[index % valueIcons.length];
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        className="p-6 bg-white rounded-xl shadow-lg text-center"
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                            <Icon className="text-white" size={28} />
                                        </div>
                                        <p className="text-gray-700 font-medium">{value}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-20 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h2 className="text-4xl font-bold mb-8">Our Story</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                {about.story}
                            </p>
                        </motion.div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
