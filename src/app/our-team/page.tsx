'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Linkedin, Twitter, RefreshCw, Facebook, Instagram, Youtube, Globe, Github, X, Quote, Plus } from 'lucide-react';
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
    linkedin_url?: string;
    twitter_url?: string;
    mail_url?: string;
    social_links?: Array<{ platform: string, url: string }>;
}

interface Category {
    id: string;
    name: string;
    order_index: number;
}

export default function OurTeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
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
            <div className="min-h-screen bg-white pt-20">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                        >
                            Our Team
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Meet the dedicated professionals driving our mission forward and delivering excellence
                        </motion.p>
                    </div>
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

                                                {/* Dynamic Social Icons Overlay */}
                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                    {(member.social_links || []).length > 0 ? (
                                                        (member.social_links || []).map((link, i) => {
                                                            const platformIcons: Record<string, any> = {
                                                                Facebook: Facebook,
                                                                Instagram: Instagram,
                                                                Youtube: Youtube,
                                                                LinkedIn: Linkedin,
                                                                Twitter: Twitter,
                                                                Github: Github,
                                                                Mail: Mail,
                                                                Website: Globe
                                                            };
                                                            const Icon = platformIcons[link.platform] || Globe;

                                                            return (
                                                                <a
                                                                    key={i}
                                                                    href={link.url.startsWith('http') ? link.url : (link.platform === 'Mail' ? `mailto:${link.url}` : link.url)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-gray-600 hover:text-primary-600 transition-colors"
                                                                >
                                                                    <Icon size={14} />
                                                                </a>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold px-2">No Socials</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2 px-4 relative z-10">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{member.name}</h3>
                                                <div className="inline-block px-3 py-1 bg-primary-50 rounded-full">
                                                    <p className="text-primary-600 font-bold text-[9px] tracking-[0.15em] uppercase">{member.role}</p>
                                                </div>
                                                <div className="pt-3">
                                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 max-w-[240px] mx-auto font-medium">
                                                        {member.bio}
                                                    </p>
                                                    {member.bio && member.bio.length > 80 && (
                                                        <button
                                                            onClick={() => setSelectedMember(member)}
                                                            className="mt-2 text-[10px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-widest transition-colors flex items-center gap-1 mx-auto"
                                                        >
                                                            Read Full Bio <Plus size={8} />
                                                        </button>
                                                    )}
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

                                                {/* Dynamic Social Icons Overlay */}
                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                    {(member.social_links || []).length > 0 ? (
                                                        (member.social_links || []).map((link, i) => {
                                                            const platformIcons: Record<string, any> = {
                                                                Facebook: Facebook,
                                                                Instagram: Instagram,
                                                                Youtube: Youtube,
                                                                LinkedIn: Linkedin,
                                                                Twitter: Twitter,
                                                                Github: Github,
                                                                Mail: Mail,
                                                                Website: Globe
                                                            };
                                                            const Icon = platformIcons[link.platform] || Globe;

                                                            return (
                                                                <a
                                                                    key={i}
                                                                    href={link.url.startsWith('http') ? link.url : (link.platform === 'Mail' ? `mailto:${link.url}` : link.url)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-gray-600 hover:text-primary-600 transition-colors"
                                                                >
                                                                    <Icon size={14} />
                                                                </a>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold px-2">No Socials</span>
                                                    )}
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

            {/* Bio Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMember(null)}
                            className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 md:bg-gray-100 md:hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X size={20} className="md:text-gray-900 text-white" />
                            </button>

                            {/* Image Section */}
                            <div className="md:w-2/5 relative h-64 md:h-auto bg-primary-900">
                                {selectedMember.image_url ? (
                                    <img
                                        src={selectedMember.image_url}
                                        alt={selectedMember.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Users className="text-white/20" size={120} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-black/20" />
                            </div>

                            {/* Content Section */}
                            <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto">
                                <div className="mb-8">
                                    <div className="inline-block px-3 py-1 bg-primary-50 rounded-full mb-4">
                                        <span className="text-primary-600 font-bold text-[10px] tracking-[0.2em] uppercase">{selectedMember.role}</span>
                                    </div>
                                    <h2 className="text-4xl font-serif text-gray-900 uppercase tracking-tight">{selectedMember.name}</h2>
                                    <div className="h-0.5 w-12 bg-primary-300 mt-4" />
                                </div>

                                <div className="relative">
                                    <Quote className="absolute -left-6 -top-4 text-primary-100" size={48} />
                                    <p className="relative z-10 text-gray-600 text-lg leading-relaxed font-light italic">
                                        {selectedMember.bio}
                                    </p>
                                </div>

                                {/* Social Links in Modal */}
                                {(selectedMember.social_links || []).length > 0 && (
                                    <div className="mt-12 pt-8 border-t border-gray-100">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Connect on Social</h4>
                                        <div className="flex gap-4">
                                            {(selectedMember.social_links || []).map((link, i) => {
                                                const platformIcons: Record<string, any> = {
                                                    Facebook: Facebook,
                                                    Instagram: Instagram,
                                                    Youtube: Youtube,
                                                    LinkedIn: Linkedin,
                                                    Twitter: Twitter,
                                                    Github: Github,
                                                    Mail: Mail,
                                                    Website: Globe
                                                };
                                                const Icon = platformIcons[link.platform] || Globe;
                                                return (
                                                    <a
                                                        key={i}
                                                        href={link.url.startsWith('http') ? link.url : (link.platform === 'Mail' ? `mailto:${link.url}` : link.url)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300"
                                                    >
                                                        <Icon size={18} />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PublicLayout>
    );
}
