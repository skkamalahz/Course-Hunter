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

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {members.filter(m => m.category === category.name).map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative"
                                        >
                                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 mb-4 border border-gray-100 group-hover:border-primary-100 transition-all duration-500 hover:shadow-2xl">
                                                {member.image_url ? (
                                                    <img
                                                        src={member.image_url}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                        <Users className="text-gray-200" size={40} />
                                                    </div>
                                                )}

                                                {/* Hover Overlay with Socials */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                                                    <a href="#" className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-primary-600 rounded-full backdrop-blur-md transition-all">
                                                        <Linkedin size={18} />
                                                    </a>
                                                    <a href="#" className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-primary-600 rounded-full backdrop-blur-md transition-all">
                                                        <Twitter size={18} />
                                                    </a>
                                                    <a href={`mailto:info@coursehunter.com`} className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-primary-600 rounded-full backdrop-blur-md transition-all">
                                                        <Mail size={18} />
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-xl font-medium text-gray-900 font-serif group-hover:text-primary-600 transition-colors uppercase tracking-tight">{member.name}</h3>
                                                <p className="text-primary-600 font-bold text-[10px] tracking-[0.2em] uppercase">{member.role}</p>
                                                <div className="pt-2">
                                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 italic font-light">
                                                        {member.bio}
                                                    </p>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {uncategorized.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative"
                                        >
                                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 mb-4 border border-gray-100 group-hover:border-primary-100 transition-all duration-500 hover:shadow-2xl">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50"><Users className="text-gray-200" size={40} /></div>
                                                )}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                                                    <a href="#" className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-primary-600 rounded-full backdrop-blur-md transition-all">
                                                        <Linkedin size={18} />
                                                    </a>
                                                    <a href="#" className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-primary-600 rounded-full backdrop-blur-md transition-all">
                                                        <Twitter size={18} />
                                                    </a>
                                                    <a href={`mailto:info@coursehunter.com`} className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-primary-600 rounded-full backdrop-blur-md transition-all">
                                                        <Mail size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-medium text-gray-900 font-serif group-hover:text-primary-600 transition-colors uppercase tracking-tight">{member.name}</h3>
                                                <p className="text-primary-600 font-bold text-[10px] tracking-[0.2em] uppercase">{member.role}</p>
                                                <div className="pt-2">
                                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 italic font-light">{member.bio}</p>
                                                </div>
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
