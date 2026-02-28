'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { X, ZoomIn, ArrowLeft, ArrowRight, Play, Film } from 'lucide-react';

// Gallery data - campaign photos, cultural events, and videos
const galleryItems = [
    // Campaign Photos
    {
        id: 1,
        type: 'image' as const,
        src: '/assets/all-images/5-1.png',
        title: 'Summer Marketing Campaign 2024',
        category: 'Campaigns',
        description: 'Successful summer marketing campaign reaching 2M+ audience'
    },
    {
        id: 2,
        type: 'image' as const,
        src: '/assets/all-images/5.png',
        title: 'Product Launch Campaign',
        category: 'Campaigns',
        description: 'Multi-channel product launch with 300% ROI'
    },
    {
        id: 3,
        type: 'image' as const,
        src: '/assets/all-images/5-1.png',
        title: 'Social Media Campaign',
        category: 'Campaigns',
        description: 'Viral social media campaign with 5M+ impressions'
    },
    {
        id: 4,
        type: 'image' as const,
        src: '/assets/all-images/5.png',
        title: 'Digital Marketing Excellence',
        category: 'Campaigns',
        description: 'Award-winning digital marketing strategy'
    },

    // Cultural Events
    {
        id: 5,
        type: 'image' as const,
        src: '/assets/all-images/5-1.png',
        title: 'Team Building Event 2024',
        category: 'Culture',
        description: 'Annual team building and cultural celebration'
    },
    {
        id: 6,
        type: 'image' as const,
        src: '/assets/all-images/5.png',
        title: 'Company Anniversary Celebration',
        category: 'Culture',
        description: 'Celebrating 5 years of excellence and innovation'
    },
    {
        id: 7,
        type: 'image' as const,
        src: '/assets/all-images/5-1.png',
        title: 'Workshop & Training Session',
        category: 'Culture',
        description: 'Professional development and skill enhancement program'
    },
    {
        id: 8,
        type: 'image' as const,
        src: '/assets/all-images/5.png',
        title: 'Festive Celebration',
        category: 'Culture',
        description: 'Cultural festival celebration with team'
    },
    {
        id: 9,
        type: 'image' as const,
        src: '/assets/all-images/5-1.png',
        title: 'Community Outreach',
        category: 'Culture',
        description: 'Giving back to our community through various initiatives'
    },

    // Videos
    {
        id: 10,
        type: 'video' as const,
        src: '/assets/all-images/5.png', // Placeholder for video thumbnail
        videoSrc: '/assets/videos/campaign.mp4', // Replace with actual video path
        title: 'Brand Campaign Video',
        category: 'Videos',
        description: 'Behind the scenes of our latest brand campaign'
    },
    {
        id: 11,
        type: 'video' as const,
        src: '/assets/all-images/5-1.png',
        videoSrc: '/assets/videos/culture.mp4',
        title: 'Company Culture Video',
        category: 'Videos',
        description: 'A day in the life at Course Hunter'
    },
    {
        id: 12,
        type: 'video' as const,
        src: '/assets/all-images/5.png',
        videoSrc: '/assets/videos/event.mp4',
        title: 'Event Highlights',
        category: 'Videos',
        description: 'Highlights from our annual company event'
    },
];

const categories = ['All', 'Campaigns', 'Culture', 'Videos'];

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const filteredItems = selectedCategory === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === selectedCategory);

    const openLightbox = (item: typeof galleryItems[0], index: number) => {
        setSelectedItem(item);
        setCurrentIndex(index);
    };

    const closeLightbox = () => {
        setSelectedItem(null);
    };

    const navigateItem = (direction: 'prev' | 'next') => {
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % filteredItems.length
            : (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        setCurrentIndex(newIndex);
        setSelectedItem(filteredItems[newIndex]);
    };

    return (
        <PublicLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl"></div>

                {/* Hero Section */}
                <section className="pt-32 pb-16 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Our Gallery
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Explore our successful marketing campaigns, vibrant company culture, and creative moments
                            </p>
                        </motion.div>

                        {/* Category Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-4 mb-16"
                        >
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${selectedCategory === category
                                            ? 'backdrop-blur-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-xl border border-white/40'
                                            : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80'
                                        }`}
                                >
                                    {category}
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Gallery Grid */}
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.5 }}
                                        whileHover={{ y: -10 }}
                                        className="group relative cursor-pointer"
                                        onClick={() => openLightbox(item, index)}
                                    >
                                        {/* 3D Glass Card */}
                                        <div className="relative backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                            {/* Glass shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                                            {/* 3D glow effect */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-300"></div>

                                            {/* Image/Video Container */}
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src={item.src}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />

                                                {/* Video Play Icon Overlay */}
                                                {item.type === 'video' && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            className="w-20 h-20 backdrop-blur-xl bg-white/20 border-2 border-white rounded-full flex items-center justify-center"
                                                        >
                                                            <Play className="w-10 h-10 text-white fill-white ml-1" />
                                                        </motion.div>
                                                    </div>
                                                )}

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 z-10">
                                                    <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                        {item.type === 'video' ? (
                                                            <>
                                                                <Film className="w-12 h-12 text-white mx-auto mb-2" />
                                                                <p className="text-white text-sm font-medium">Click to play</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ZoomIn className="w-12 h-12 text-white mx-auto mb-2" />
                                                                <p className="text-white text-sm font-medium">Click to view</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-6 relative z-10">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`inline-block px-3 py-1 backdrop-blur-sm border rounded-full text-sm font-semibold ${item.category === 'Campaigns'
                                                            ? 'bg-primary-500/20 border-primary-300/40 text-primary-700'
                                                            : item.category === 'Culture'
                                                                ? 'bg-accent-500/20 border-accent-300/40 text-accent-700'
                                                                : 'bg-purple-500/20 border-purple-300/40 text-purple-700'
                                                        }`}>
                                                        {item.category}
                                                    </div>
                                                    {item.type === 'video' && (
                                                        <div className="inline-flex items-center gap-1 px-2 py-1 backdrop-blur-sm bg-gray-500/20 border border-gray-300/40 rounded-full text-xs font-semibold text-gray-700">
                                                            <Film size={12} />
                                                            Video
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                            onClick={closeLightbox}
                        >
                            {/* Close Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={closeLightbox}
                                className="absolute top-6 right-6 p-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-50"
                            >
                                <X size={24} />
                            </motion.button>

                            {/* Navigation Buttons */}
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateItem('prev');
                                }}
                                className="absolute left-6 p-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-50"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateItem('next');
                                }}
                                className="absolute right-6 p-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-50"
                            >
                                <ArrowRight size={24} />
                            </motion.button>

                            {/* Media Container */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative max-w-6xl w-full backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <div className="relative aspect-video">
                                    {selectedItem.type === 'video' ? (
                                        <video
                                            controls
                                            autoPlay
                                            className="w-full h-full object-contain bg-black"
                                            src={selectedItem.videoSrc}
                                        >
                                            <source src={selectedItem.videoSrc} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <Image
                                            src={selectedItem.src}
                                            alt={selectedItem.title}
                                            fill
                                            className="object-contain"
                                        />
                                    )}
                                </div>
                                <div className="p-6 backdrop-blur-xl bg-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`inline-block px-3 py-1 backdrop-blur-sm border rounded-full text-sm font-semibold ${selectedItem.category === 'Campaigns'
                                                ? 'bg-primary-500/30 border-primary-300/40 text-white'
                                                : selectedItem.category === 'Culture'
                                                    ? 'bg-accent-500/30 border-accent-300/40 text-white'
                                                    : 'bg-purple-500/30 border-purple-300/40 text-white'
                                            }`}>
                                            {selectedItem.category}
                                        </div>
                                        {selectedItem.type === 'video' && (
                                            <div className="inline-flex items-center gap-1 px-2 py-1 backdrop-blur-sm bg-white/20 border border-white/30 rounded-full text-xs font-semibold text-white">
                                                <Film size={12} />
                                                Video
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {selectedItem.title}
                                    </h3>
                                    <p className="text-gray-200 leading-relaxed">
                                        {selectedItem.description}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PublicLayout>
    );
}
