'use client';

import { motion } from 'framer-motion';
import { Users, Mail, Linkedin, Twitter, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    image_url?: string;
    category: string;
    order_index: number;
}

interface Category {
    id: string;
    name: string;
    order_index: number;
}

export default function OurTeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [catResult, memberResult] = await Promise.all([
                    supabase.from('team_categories').select('*').order('order_index', { ascending: true }),
                    supabase.from('team_members').select('*').order('order_index', { ascending: true })
                ]);

                if (catResult.error) throw catResult.error;
                if (memberResult.error) throw memberResult.error;

                setCategories(catResult.data || []);
                setMembers(memberResult.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Filter out categories that have no members to keep the UI clean
    const activeCategories = categories.filter(cat =>
        members.some(m => m.category === cat.name)
    );

    // Handle members that might be in a deleted or non-existent category
    const uncategorized = members.filter(m =>
        !categories.some(c => c.name === m.category)
    );

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                    <RefreshCw className="animate-spin text-primary-500" size={48} />
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-white">
                {/* Banner Section */}
                <section className="relative h-[40vh] flex items-center justify-center bg-primary-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">OUR TEAM</h1>
                        <div className="h-1.5 w-24 bg-accent-500 mx-auto"></div>
                    </motion.div>
                </section>

                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Display Active Categories */}
                        {activeCategories.map((category, catIndex) => (
                            <div key={category.id} className={catIndex > 0 ? 'mt-32' : ''}>
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent uppercase tracking-tight">
                                        {category.name}
                                    </h2>
                                    <div className="h-1 w-20 bg-primary-500 mx-auto mt-6"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                    {members.filter(m => m.category === category.name).map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary-100"
                                        >
                                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                                {member.image_url ? (
                                                    <img
                                                        src={member.image_url}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Users className="text-gray-300" size={80} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                                <div className="absolute bottom-6 left-8 right-8">
                                                    <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{member.name}</h3>
                                                    <p className="text-accent-400 font-bold text-xs tracking-widest uppercase">{member.role}</p>
                                                </div>
                                            </div>

                                            <div className="p-10">
                                                <p className="text-gray-600 leading-relaxed mb-8 line-clamp-4 text-sm font-medium">
                                                    {member.bio}
                                                </p>
                                                <div className="flex space-x-4 border-t border-gray-100 pt-8">
                                                    <a href="#" className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                                        <Linkedin size={20} />
                                                    </a>
                                                    <a href="#" className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                                        <Twitter size={20} />
                                                    </a>
                                                    <a href={`mailto:info@coursehunter.com`} className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                                        <Mail size={20} />
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Display Uncategorized members if any */}
                        {uncategorized.length > 0 && (
                            <div className="mt-32">
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent uppercase tracking-tight">
                                        Our Team
                                    </h2>
                                    <div className="h-1 w-20 bg-primary-500 mx-auto mt-6"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                    {uncategorized.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                                        >
                                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center"><Users className="text-gray-300" size={80} /></div>
                                                )}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute bottom-6 left-8 right-8">
                                                    <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{member.name}</h3>
                                                    <p className="text-accent-400 font-bold text-xs tracking-widest uppercase">{member.role}</p>
                                                </div>
                                            </div>
                                            <div className="p-10">
                                                <p className="text-gray-600 leading-relaxed mb-8 line-clamp-4 text-sm font-medium">{member.bio}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
