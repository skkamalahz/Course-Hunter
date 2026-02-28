'use client';

import { motion } from 'framer-motion';
import { Users, Mail, Linkedin, Twitter } from 'lucide-react';
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

export default function OurTeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeam() {
            try {
                const { data, error } = await supabase
                    .from('team_members')
                    .select('*')
                    .order('order_index', { ascending: true });

                if (error) throw error;
                setMembers(data || []);
            } catch (error) {
                console.error('Error fetching team:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTeam();
    }, []);

    const groupedMembers = members.reduce((acc, member) => {
        const cat = member.category || 'Team';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(member);
        return acc;
    }, {} as Record<string, TeamMember[]>);

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">OUR TEAM</h1>
                        <div className="h-1.5 w-24 bg-accent-500 mx-auto"></div>
                    </motion.div>
                </section>

                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {Object.entries(groupedMembers).sort(([a], [b]) => (a === 'Founder' || a === 'Founders' ? -1 : 1)).map(([category, catMembers], catIndex) => (
                            <div key={category} className={catIndex > 0 ? 'mt-24' : ''}>
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent uppercase tracking-tight">
                                        {category}
                                    </h2>
                                    <div className="h-1 w-20 bg-primary-500 mx-auto mt-4"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                    {catMembers.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                                        >
                                            <div className="relative aspect-[4/5] overflow-hidden">
                                                {member.image_url ? (
                                                    <img
                                                        src={member.image_url}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                        <Users className="text-gray-300" size={80} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>

                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{member.name}</h3>
                                                    <p className="text-accent-400 font-semibold text-sm tracking-widest uppercase">{member.role}</p>
                                                </div>
                                            </div>

                                            <div className="p-8">
                                                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">
                                                    {member.bio}
                                                </p>
                                                <div className="flex space-x-4 border-t border-gray-100 pt-6">
                                                    <a href="#" className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:bg-primary-500 hover:text-white transition-all hover:scale-110">
                                                        <Linkedin size={18} />
                                                    </a>
                                                    <a href="#" className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:bg-primary-500 hover:text-white transition-all hover:scale-110">
                                                        <Twitter size={18} />
                                                    </a>
                                                    <a href={`mailto:info@coursehunter.com`} className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:bg-primary-500 hover:text-white transition-all hover:scale-110">
                                                        <Mail size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
