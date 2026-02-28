'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

export default function ContactUsPage() {
    const [contact, setContact] = useState({
        email: 'info@coursehunter.com',
        phone: '+1 (555) 123-4567',
        address: '123 Marketing Street, Digital City, DC 12345'
    });
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
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
            console.error('Error fetching contact for ContactUsPage:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission (could be saved to a 'messages' table if needed)
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                            Contact Us
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Get in touch with us. We'd love to hear from you!
                        </motion.p>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Information */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Email</h3>
                                            <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-primary-600">
                                                {contact.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Phone</h3>
                                            <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="text-gray-600 hover:text-primary-600">
                                                {contact.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Address</h3>
                                            <p className="text-gray-600 whitespace-pre-line">{contact.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Placeholder */}
                                <div className="mt-8 rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                                    <p className="text-gray-500">Map Integration Area</p>
                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-2xl">
                                    <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                                        >
                                            <span>Send Message</span>
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
