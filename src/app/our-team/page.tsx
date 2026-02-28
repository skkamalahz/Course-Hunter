'use client';

import { motion } from 'framer-motion';
import { Linkedin, Twitter, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    social?: {
        linkedin?: string;
        twitter?: string;
    };
}

export default function OurTeamPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setTeam(data || []);
        } catch (error) {
            console.error('Error fetching team members:', error);
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
                            Our Team
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Meet the talented individuals who make it all happen
                        </motion.p>
                    </div>
                </section>

                {/* Team Grid */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="group"
                                >
                                    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
                                        <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                                            <div className="w-40 h-40 bg-gradient-to-br from-primary-300 to-accent-300 rounded-full"></div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-8">
                                            <div className="flex space-x-4">
                                                <a
                                                    href={member.social?.linkedin || '#'}
                                                    className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                                                >
                                                    <Linkedin className="text-white" size={24} />
                                                </a>
                                                <a
                                                    href={member.social?.twitter || '#'}
                                                    className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                                                >
                                                    <Twitter className="text-white" size={24} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                                    <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
