'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const footerLinks = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Career', href: '/career' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'Our Team', href: '/our-team' },
];

const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
    const [contact, setContact] = useState({
        email: 'info@coursehunter.com',
        phone: '+1 (555) 123-4567',
        address: '123 Marketing Street, Digital City, DC 12345'
    });

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        try {
            const { data, error } = await supabase
                .from('contact_settings')
                .select('*')
                .eq('id', 'contact_001')
                .single();

            if (data) {
                setContact({
                    email: data.email,
                    phone: data.phone,
                    address: data.address
                });
            }
        } catch (error) {
            console.error('Error fetching contact for footer:', error);
        }
    };

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="mb-4">
                            <div className="relative h-16 w-56">
                                <Image
                                    src="/assets/logo/Coursehunter_logo.png"
                                    alt="Course Hunter Logo"
                                    fill
                                    className="object-contain object-left brightness-0 invert"
                                />
                            </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                            360 degree marketing solution provider
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg hover:bg-primary-600 hover:border-primary-500 transition-all duration-300 hover:scale-110"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-primary-400 transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 group">
                                <Mail size={20} className="text-primary-400 mt-1 group-hover:scale-110 transition-transform" />
                                <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-primary-400 transition-colors">
                                    {contact.email}
                                </a>
                            </li>
                            <li className="flex items-start space-x-3 group">
                                <Phone size={20} className="text-primary-400 mt-1 group-hover:scale-110 transition-transform" />
                                <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="text-gray-300 hover:text-primary-400 transition-colors">
                                    {contact.phone}
                                </a>
                            </li>
                            <li className="flex items-start space-x-3 group">
                                <MapPin size={20} className="text-primary-400 mt-1 group-hover:scale-110 transition-transform" />
                                <span className="text-gray-300 whitespace-pre-line">
                                    {contact.address}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <h4 className="text-lg font-semibold mb-4 text-white">Newsletter</h4>
                        <p className="text-gray-300 mb-4">
                            Subscribe to get the latest updates and news.
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:border-primary-400 focus:bg-white/20 transition-all placeholder-gray-400 text-white"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg hover:opacity-90 hover:scale-105 transition-all font-medium shadow-lg"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 mt-8 pt-8">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <p className="text-gray-400">&copy; {new Date().getFullYear()} Course Hunter. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
