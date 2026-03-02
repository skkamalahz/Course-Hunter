'use client';

import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    posted_date: string;
    description: string;
    requirements: string[];
}

export default function CareerPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('careers')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
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
                            Career
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Join our team and be part of something amazing
                        </motion.p>
                    </div>
                </section>

                {/* Job Listings */}
                <section className="py-20 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-8">
                            {jobs.length > 0 ? (
                                jobs.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary-300 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-3">{job.title}</h3>
                                                <div className="flex flex-wrap gap-4 text-gray-600">
                                                    <span className="flex items-center space-x-2">
                                                        <MapPin size={18} className="text-primary-600" />
                                                        <span>{job.location}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-2">
                                                        <Briefcase size={18} className="text-primary-600" />
                                                        <span>{job.type}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-2">
                                                        <Calendar size={18} className="text-primary-600" />
                                                        <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                                                Apply Now
                                            </button>
                                        </div>

                                        <p className="text-gray-700 mb-6">{job.description}</p>

                                        <div>
                                            <h4 className="font-semibold mb-3 text-lg">Requirements:</h4>
                                            <ul className="space-y-2">
                                                {job.requirements?.map((req, idx) => (
                                                    <li key={idx} className="flex items-start space-x-2">
                                                        <span className="text-primary-600 mt-1">✓</span>
                                                        <span className="text-gray-600">{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500 text-lg">No open positions at the moment. Please check back later!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
