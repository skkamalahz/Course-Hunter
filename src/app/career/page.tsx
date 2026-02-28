'use client';

import { motion } from 'framer-motion';
import careersData from '@/data/careers.json';
import { MapPin, Clock, Briefcase, Calendar } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function CareerPage() {
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
                            {careersData.map((job, index) => (
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
                                                    <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
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
                                            {job.requirements.map((req, idx) => (
                                                <li key={idx} className="flex items-start space-x-2">
                                                    <span className="text-primary-600 mt-1">✓</span>
                                                    <span className="text-gray-600">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
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
