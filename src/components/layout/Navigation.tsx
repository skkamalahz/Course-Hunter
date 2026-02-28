'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Team', href: '/our-team' },
    { name: 'Our Work', href: '/our-work' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Career', href: '/career' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact Us', href: '/contact-us' },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white shadow-lg py-2'
                : 'bg-white/95 backdrop-blur-lg shadow-md py-3'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-3 items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative h-14 w-48 md:h-16 md:w-56"
                        >
                            <Image
                                src="/assets/logo/Coursehunter_logo.png"
                                alt="Course Hunter Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden lg:flex items-center justify-center space-x-1 flex-nowrap whitespace-nowrap">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    className="relative px-3 py-2 text-gray-700 font-medium text-[14px] hover:text-primary-600 transition-colors duration-200 group whitespace-nowrap"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right side - CTA Button (Desktop) & Mobile Menu Button */}
                    <div className="flex items-center justify-end gap-4">
                        {/* CTA Button */}
                        <div className="hidden lg:block">
                            <Link
                                href="/contact-us"
                                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden bg-white/98 backdrop-blur-lg border-t border-gray-100"
                    >
                        <div className="px-6 py-6 space-y-2">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-3 px-4 rounded-xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 transition-all duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-4">
                                <Link
                                    href="/contact-us"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center py-3 px-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
