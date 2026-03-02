'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import * as Icons from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    order_index: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .order('order_index');

                if (error) throw error;
                setServices(data || []);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const getIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName] || Icons.Briefcase;
        return <IconComponent size={32} className="text-primary-600" />;
    };

    return (
        <PublicLayout>
            <div className="relative pt-32 pb-20 overflow-hidden bg-[#fafafa]">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary-50 rounded-full blur-3xl opacity-50 z-0"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-accent-50 rounded-full blur-3xl opacity-30 z-0"></div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest text-primary-600 mb-6"
                        >
                            Our Expertise
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-gray-900 mb-8 leading-tight"
                        >
                            Innovative <span className="text-primary-600">Solutions</span> for Your Business
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-600 leading-relaxed font-sans"
                        >
                            We combine creativity with data-driven strategies to help your brand stand out in the digital landscape. Explore our wide range of professional services tailored to your needs.
                        </motion.p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Icons.RefreshCw className="animate-spin text-primary-600" size={40} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="group relative h-full"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition duration-500 blur"></div>
                                    <div className="relative h-full bg-white border border-gray-100 p-8 rounded-3xl shadow-sm group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        {/* Hover Gradient Overlay */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>

                                        <div className="relative mb-6 p-4 bg-gray-50 rounded-2xl w-fit group-hover:bg-primary-50 transition-colors duration-300">
                                            {getIcon(service.icon)}
                                        </div>

                                        <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                                            {service.title}
                                        </h3>

                                        <p className="text-gray-600 leading-relaxed font-sans mb-6">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center text-primary-600 font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                                            <span>Learn More</span>
                                            <Icons.ArrowRight size={16} className="ml-2" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <section className="py-24 bg-white overflow-hidden relative">
                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-primary-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-900 opacity-50"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
                                Ready to scale your brand?
                            </h2>
                            <p className="text-lg text-primary-100 font-sans mb-12 max-w-2xl mx-auto">
                                Let's collaborate to build something extraordinary. Our team is ready to transform your vision into reality.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <a
                                    href="/contact-us"
                                    className="px-10 py-5 bg-white text-primary-900 font-bold rounded-2xl hover:bg-primary-50 transition-all hover:scale-105 shadow-xl"
                                >
                                    Get Started Now
                                </a>
                                <a
                                    href="/our-work"
                                    className="px-10 py-5 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                                >
                                    View Our Work
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
