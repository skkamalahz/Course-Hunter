'use client';

import { motion } from 'framer-motion';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const stats = [
    { icon: Users, label: 'Team Members', value: '3', color: 'from-blue-500 to-blue-600', link: '/admin/team' },
    { icon: Briefcase, label: 'Projects', value: '3', color: 'from-purple-500 to-purple-600', link: '/admin/work' },
    { icon: FileText, label: 'Job Listings', value: '2', color: 'from-green-500 to-green-600', link: '/admin/careers' },
    { icon: TrendingUp, label: 'Services', value: '9', color: 'from-orange-500 to-orange-600', link: '/admin/content' },
];

export default function AdminDashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome to the admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                                        <Icon className="text-white" size={24} />
                                    </div>
                                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/admin/team">
                        <button className="w-full px-6 py-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium text-left">
                            Add Team Member
                        </button>
                    </Link>
                    <Link href="/admin/work">
                        <button className="w-full px-6 py-4 bg-accent-50 text-accent-700 rounded-lg hover:bg-accent-100 transition-colors font-medium text-left">
                            Add Portfolio Item
                        </button>
                    </Link>
                    <Link href="/admin/careers">
                        <button className="w-full px-6 py-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-left">
                            Post New Job
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
