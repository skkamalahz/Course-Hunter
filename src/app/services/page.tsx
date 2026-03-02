'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import * as Icons from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Service {
    id: string;
    title: string;
    description: string;
    detailed_description: string;
    icon: string;
    image_url: string;
    order_index: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [header, setHeader] = useState({ title: 'Services', subtitle: 'Explore our professional solutions tailored to your business needs and drive sustainable growth.' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, headerRes] = await Promise.all([
                    supabase.from('services').select('*').order('order_index'),
                    supabase.from('page_headers').select('*').eq('page_path', '/services').single()
                ]);

                if (servicesRes.error) throw servicesRes.error;
                setServices(servicesRes.data || []);

                if (headerRes.data) {
                    setHeader({
                        title: headerRes.data.title,
                        subtitle: headerRes.data.subtitle
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName] || Icons.Briefcase;
        return <IconComponent size={32} className="text-primary-600" />;
    };

    return (
        <PublicLayout>
            <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                    >
                        {header.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        {header.subtitle}
                    </motion.p>
                </div>
            </section>

            <div className="relative pt-20 pb-20 overflow-hidden bg-[#fafafa]">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary-50 rounded-full blur-3xl opacity-50 z-0"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-accent-50 rounded-full blur-3xl opacity-30 z-0"></div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Icons.RefreshCw className="animate-spin text-primary-600" size={40} />
                        </div>
                    ) : (
                        <div className="space-y-32">
                            {services.map((service, index) => (
                                <motion.section
                                    key={service.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                                >
                                    {/* Content Side */}
                                    <div className="flex-1 space-y-8 text-left">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                                                {getIcon(service.icon)}
                                            </div>
                                            <div className="h-px flex-1 bg-gradient-to-r from-primary-100 to-transparent"></div>
                                        </div>

                                        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
                                            {service.title}
                                        </h2>

                                        <p className="text-gray-600 text-lg leading-relaxed font-sans border-l-4 border-primary-600 pl-6 py-2 bg-primary-50/30 rounded-r-2xl italic">
                                            {service.description}
                                        </p>

                                        <p className="text-gray-500 leading-relaxed font-sans whitespace-pre-wrap">
                                            {service.detailed_description || "We provide top-notch professional solutions tailored to your specific business goals, ensuring maximum impact and sustainable growth in your industry."}
                                        </p>

                                        <motion.a
                                            href="/contact-us"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center px-8 py-4 bg-primary-900 text-white font-bold rounded-2xl hover:bg-primary-800 transition-all shadow-lg group"
                                        >
                                            <span>Inquire Now</span>
                                            <Icons.ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                                        </motion.a>
                                    </div>

                                    {/* Image Side */}
                                    <div className="flex-1 w-full">
                                        <div className="relative aspect-video lg:aspect-square group">
                                            {/* Decorative Background for Image */}
                                            <div className="absolute -inset-4 bg-gradient-to-br from-primary-100 to-accent-50 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

                                            <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl">
                                                {service.image_url ? (
                                                    <img
                                                        src={service.image_url}
                                                        alt={service.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-12">
                                                        <div className="text-center space-y-4">
                                                            <div className="p-6 bg-white/50 backdrop-blur-md rounded-full inline-block">
                                                                {(Icons as any)[service.icon] ?
                                                                    React.createElement((Icons as any)[service.icon], { size: 64, className: "text-gray-400" }) :
                                                                    <Icons.Briefcase size={64} className="text-gray-400" />
                                                                }
                                                            </div>
                                                            <p className="text-gray-400 font-medium italic">Visualization coming soon</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Glass overlay on hover */}
                                                <div className="absolute inset-0 bg-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <section className="py-24 bg-white overflow-hidden relative border-t border-gray-100">
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
