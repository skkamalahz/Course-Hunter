'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface PageHeaderData {
    title: string;
    subtitle: string;
    bg_type: string;
    bg_value: string;
    text_color: string;
    header_height: string;
}

interface PageHeaderProps {
    pagePath: string;
}

export default function PageHeader({ pagePath }: PageHeaderProps) {
    const [header, setHeader] = useState<PageHeaderData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHeader() {
            try {
                const { data, error } = await supabase
                    .from('page_headers')
                    .select('*')
                    .eq('page_path', pagePath)
                    .single();

                if (error) {
                    console.error('Error fetching page header:', error);
                    return;
                }
                setHeader(data);
            } catch (error) {
                console.error('Error in fetchHeader:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchHeader();
    }, [pagePath]);

    if (loading) return <div className="h-64 bg-gray-50 animate-pulse"></div>;
    if (!header) return null;

    const bgStyle = header.bg_type === 'image'
        ? { backgroundImage: `url(${header.bg_value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : header.bg_type === 'color'
            ? { backgroundColor: header.bg_value }
            : undefined;

    const bgClass = header.bg_type === 'gradient' ? `bg-gradient-to-br ${header.bg_value}` : '';

    return (
        <section
            className={`relative ${header.header_height} ${bgClass} overflow-hidden flex items-center justify-center`}
            style={bgStyle}
        >
            {/* Overlay for image background */}
            {header.bg_type === 'image' && (
                <div className="absolute inset-0 bg-black/40 z-0"></div>
            )}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-5xl md:text-7xl font-serif mb-6 ${header.text_color} leading-tight`}
                >
                    {header.bg_type === 'gradient' ? (
                        <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            {header.title}
                        </span>
                    ) : (
                        header.title
                    )}
                </motion.h1>

                {header.subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`text-xl md:text-2xl ${header.bg_type === 'image' ? 'text-white/90' : 'text-gray-600'} max-w-3xl mx-auto font-sans font-light italic`}
                    >
                        {header.subtitle}
                    </motion.p>
                )}
            </div>
        </section>
    );
}
