'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Layout, Info, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminContentPage() {
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [homeData, setHomeData] = useState({ title: '', subtitle: '', cta_text: '' });
    const [aboutData, setAboutData] = useState({ title: '', mission: '', vision: '', story: '' });
    const [contactData, setContactData] = useState({ email: '', phone: '', address: '' });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [heroRes, aboutRes, contactRes] = await Promise.all([
                supabase.from('hero_settings').select('*').eq('id', 'hero_001').single(),
                supabase.from('about_settings').select('*').eq('id', 'about_001').single(),
                supabase.from('contact_settings').select('*').eq('id', 'contact_001').single()
            ]);

            if (heroRes.data) setHomeData({
                title: heroRes.data.title,
                subtitle: heroRes.data.subtitle,
                cta_text: heroRes.data.cta_text
            });
            if (aboutRes.data) setAboutData({
                title: aboutRes.data.title,
                mission: aboutRes.data.mission,
                vision: aboutRes.data.vision,
                story: aboutRes.data.story
            });
            if (contactRes.data) setContactData({
                email: contactRes.data.email,
                phone: contactRes.data.phone,
                address: contactRes.data.address
            });
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveHome = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('hero_settings')
                .update(homeData)
                .eq('id', 'hero_001');
            if (error) throw error;
            alert('Home content updated!');
        } catch (error) {
            alert('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAbout = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('about_settings')
                .update(aboutData)
                .eq('id', 'about_001');
            if (error) throw error;
            alert('About content updated!');
        } catch (error) {
            alert('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveContact = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('contact_settings')
                .update(contactData)
                .eq('id', 'contact_001');
            if (error) throw error;
            alert('Contact content updated!');
        } catch (error) {
            alert('Save failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    const tabs = [
        { id: 'home', label: 'Home Page', icon: Layout },
        { id: 'about', label: 'About Us', icon: Info },
        { id: 'contact', label: 'Contact', icon: Mail },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Content Management
                </h1>
                <p className="text-gray-600">Edit website content and global settings</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-8 border-b border-gray-100 pb-px">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all relative ${activeTab === tab.id
                                ? 'text-primary-600'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            <Icon size={18} />
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl shadow-xl p-8">
                {activeTab === 'home' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Home Page Content</h2>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                            <input
                                type="text"
                                value={homeData.title}
                                onChange={(e) => setHomeData({ ...homeData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
                            <textarea
                                value={homeData.subtitle}
                                onChange={(e) => setHomeData({ ...homeData, subtitle: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Button Text</label>
                            <input
                                type="text"
                                value={homeData.cta_text}
                                onChange={(e) => setHomeData({ ...homeData, cta_text: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleSaveHome}
                            disabled={saving}
                            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center space-x-2 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            <span>Save Home Content</span>
                        </button>
                    </motion.div>
                )}

                {activeTab === 'about' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">About Us Content</h2>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Main Title</label>
                            <input
                                type="text"
                                value={aboutData.title}
                                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Our Mission</label>
                                <textarea
                                    value={aboutData.mission}
                                    onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Our Vision</label>
                                <textarea
                                    value={aboutData.vision}
                                    onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Our Story</label>
                            <textarea
                                value={aboutData.story}
                                onChange={(e) => setAboutData({ ...aboutData, story: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleSaveAbout}
                            disabled={saving}
                            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center space-x-2 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            <span>Save About Content</span>
                        </button>
                    </motion.div>
                )}

                {activeTab === 'contact' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={contactData.email}
                                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={contactData.phone}
                                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                            <textarea
                                value={contactData.address}
                                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleSaveContact}
                            disabled={saving}
                            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center space-x-2 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            <span>Save Contact Info</span>
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
