'use client';

import { motion } from 'framer-motion';

interface PageBannerProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

export default function PageBanner({ title, subtitle, backgroundImage }: PageBannerProps) {
    return (
        <section className={`relative py-20 pt-32 overflow-hidden ${!backgroundImage ? 'bg-gradient-to-br from-primary-50 via-white to-accent-50' : ''}`}>
            {backgroundImage && (
                <>
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px]" />
                </>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </section>
    );
}
