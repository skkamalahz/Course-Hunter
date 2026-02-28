'use client';

import { motion } from 'framer-motion';
import { Users, Mail, Phone, ExternalLink, Linkedin, Twitter, Github, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

export default function OurTeamPage() {
    const [members, setMembers] = useState<any[]>([]);
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {members.map((member, index) => (
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
                                            <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                                            <p className="text-accent-400 font-semibold">{member.role}</p>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {member.bio}
                                        </p>
                                        <div className="flex space-x-4">
                                            <a href="#" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-primary-500 hover:text-white transition-all">
                                                <Linkedin size={18} />
                                            </a>
                                            <a href="#" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-primary-500 hover:text-white transition-all">
                                                <Twitter size={18} />
                                            </a>
                                            <a href={`mailto:info@coursehunter.com`} className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-primary-500 hover:text-white transition-all">
                                                <Mail size={18} />
                                            </a>
                                        </div>
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
