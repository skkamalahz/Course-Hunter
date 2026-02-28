'use client';

import { motion } from 'framer-motion';
import { Users, Briefcase, FileText, TrendingUp, Handshake, Image as ImageIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState([
        { icon: Users, label: 'Team Members', value: '...', color: 'from-blue-500 to-blue-600', link: '/admin/team', table: 'team_members' },
        { icon: Briefcase, label: 'Portfolio Items', value: '...', color: 'from-purple-500 to-purple-600', link: '/admin/work', table: 'portfolio_items' },
        { icon: FileText, label: 'Job Listings', value: '...', color: 'from-green-500 to-green-600', link: '/admin/careers', table: 'careers' },
        { icon: Handshake, label: 'Clients', value: '...', color: 'from-orange-500 to-orange-600', link: '/admin/clients', table: 'clients' },
    ]);

    useEffect(() => {
        async function fetchStats() {
            const updatedStats = await Promise.all(stats.map(async (stat) => {
                const { count, error } = await supabase
                    .from(stat.table)
                    .select('*', { count: 'exact', head: true });

                return { ...stat, value: error ? '0' : String(count || 0) };
            }));
            setStats(updatedStats);
        }
        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Admin Dashboard</h1>
                <p className="text-lg text-gray-500">Welcome back! Here's an overview of your website content.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={stat.link}>
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150`}></div>
                                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20`}>
                                        <Icon className="text-white" size={28} />
                                    </div>
                                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Quick Management</h2>
                    <span className="text-xs font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full text-center">Actions</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickActionLink href="/admin/hero" icon={ImageIcon} label="Update Hero Section" color="text-indigo-600" bg="bg-indigo-50" />
                    <Link href="/admin/team">
                        <button className="w-full p-6 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-all font-bold text-left flex items-center justify-between group shadow-sm">
                            <div className="flex items-center space-x-4">
                                <Users size={24} />
                                <span>Add Team Member</span>
                            </div>
                            <Plus size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </Link>
                    <Link href="/admin/work">
                        <button className="w-full p-6 bg-purple-50 text-purple-700 rounded-2xl hover:bg-purple-100 transition-all font-bold text-left flex items-center justify-between group shadow-sm">
                            <div className="flex items-center space-x-4">
                                <Briefcase size={24} />
                                <span>Add Portfolio Item</span>
                            </div>
                            <Plus size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </Link>
                    <Link href="/admin/careers">
                        <button className="w-full p-6 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-all font-bold text-left flex items-center justify-between group shadow-sm">
                            <div className="flex items-center space-x-4">
                                <FileText size={24} />
                                <span>Post New Job</span>
                            </div>
                            <Plus size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </Link>
                    <Link href="/admin/clients">
                        <button className="w-full p-6 bg-orange-50 text-orange-700 rounded-2xl hover:bg-orange-100 transition-all font-bold text-left flex items-center justify-between group shadow-sm">
                            <div className="flex items-center space-x-4">
                                <Handshake size={24} />
                                <span>Add New Client</span>
                            </div>
                            <Plus size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </Link>
                    <QuickActionLink href="/admin/content" icon={TrendingUp} label="Manage Services" color="text-pink-600" bg="bg-pink-50" />
                </div>
            </div>
        </div>
    );
}

function QuickActionLink({ href, icon: Icon, label, color, bg }: any) {
    return (
        <Link href={href}>
            <button className={`w-full p-6 ${bg} ${color} rounded-2xl hover:shadow-md transition-all font-bold text-left flex items-center justify-between group shadow-sm`}>
                <div className="flex items-center space-x-4">
                    <Icon size={24} />
                    <span>{label}</span>
                </div>
                <TrendingUp size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </Link>
    );
}
