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
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight font-serif uppercase animate-fade-up">OUR TEAM</h1>
                        <div className="h-0.5 w-16 bg-accent-500/60 mx-auto"></div>
                    </motion.div>
                </section>

                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Display Active Categories */}
                        {activeCategories.map((category, catIndex) => (
                            <div key={category.id} className={catIndex > 0 ? 'mt-32' : ''}>
                                <div className="text-center mb-16">
                                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 uppercase tracking-widest">
                                        {category.name}
                                    </h2>
                                    <div className="h-px w-12 bg-primary-300 mx-auto mt-4"></div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-x-8 gap-y-16">
                                    {members.filter(m => m.category === category.name).map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05, duration: 0.5 }}
                                            className="group text-center w-full sm:w-[280px]"
                                        >
                                            <div className="relative mb-8 mx-auto w-48 h-48 sm:w-56 sm:h-56">
                                                {/* Decorative background circle */}
                                                <div className="absolute inset-0 bg-primary-50 rounded-full scale-100 group-hover:scale-110 transition-transform duration-500 ease-out shadow-sm"></div>

                                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white group-hover:border-primary-100 transition-colors duration-500 shadow-lg group-hover:shadow-2xl">
                                                    {member.image_url ? (
                                                        <img
                                                            src={member.image_url}
                                                            alt={member.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                            <Users className="text-gray-200" size={48} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Social Icons Overlay - Professional Style */}
                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                    <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                                                        <Linkedin size={14} />
                                                    </a>
                                                    <div className="w-px h-3 bg-gray-200"></div>
                                                    <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                                                        <Twitter size={14} />
                                                    </a>
                                                    <div className="w-px h-3 bg-gray-200"></div>
                                                    <a href={`mailto:info@coursehunter.com`} className="text-gray-600 hover:text-primary-600 transition-colors">
                                                        <Mail size={14} />
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="space-y-2 px-4 relative z-10">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{member.name}</h3>
                                                <div className="inline-block px-3 py-1 bg-primary-50 rounded-full">
                                                    <p className="text-primary-600 font-bold text-[9px] tracking-[0.15em] uppercase">{member.role}</p>
                                                </div>
                                                <div className="pt-3">
                                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 max-w-[240px] mx-auto font-medium">
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
                                    <h2 className="text-3xl font-serif text-gray-900 uppercase tracking-widest">
                                        Our Team
                                    </h2>
                                    <div className="h-px w-12 bg-primary-300 mx-auto mt-4"></div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-x-8 gap-y-16">
                                    {uncategorized.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05, duration: 0.5 }}
                                            className="group text-center w-full sm:w-[280px]"
                                        >
                                            <div className="relative mb-8 mx-auto w-48 h-48 sm:w-56 sm:h-56">
                                                {/* Decorative background circle */}
                                                <div className="absolute inset-0 bg-primary-50 rounded-full scale-100 group-hover:scale-110 transition-transform duration-500 ease-out shadow-sm"></div>

                                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white group-hover:border-primary-100 transition-colors duration-500 shadow-lg group-hover:shadow-2xl">
                                                    {member.image_url ? (
                                                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50"><Users className="text-gray-200" size={48} /></div>
                                                    )}
                                                </div>

                                                {/* Social Icons Overlay - Professional Style */}
                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                    <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                                                        <Linkedin size={14} />
                                                    </a>
                                                    <div className="w-px h-3 bg-gray-200"></div>
                                                    <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                                                        <Twitter size={14} />
                                                    </a>
                                                    <div className="w-px h-3 bg-gray-200"></div>
                                                    <a href={`mailto:info@coursehunter.com`} className="text-gray-600 hover:text-primary-600 transition-colors">
                                                        <Mail size={14} />
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="space-y-2 px-4 relative z-10">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{member.name}</h3>
                                                <div className="inline-block px-3 py-1 bg-primary-50 rounded-full">
                                                    <p className="text-primary-600 font-bold text-[9px] tracking-[0.15em] uppercase">{member.role}</p>
                                                </div>
                                                <div className="pt-3">
                                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 max-w-[240px] mx-auto font-medium">{member.bio}</p>
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
