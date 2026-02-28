'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function HeroManagementPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hero, setHero] = useState({
        title: '',
        subtitle: '',
        cta_text: '',
        cta_link: '',
        background_image: ''
    });

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        try {
            const { data, error } = await supabase
                .from('hero_settings')
                .select('*')
                .eq('id', 'hero_001')
                .single();

            if (error) throw error;
            if (data) {
                setHero({
                    title: data.title,
                    subtitle: data.subtitle,
                    cta_text: data.cta_text,
                    cta_link: data.cta_link,
                    background_image: data.background_image
                });
            }
        } catch (error) {
            console.error('Error fetching hero:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('hero_settings')
                .update({
                    title: hero.title,
                    subtitle: hero.subtitle,
                    cta_text: hero.cta_text,
                    cta_link: hero.cta_link,
                    background_image: hero.background_image,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 'hero_001');

            if (error) throw error;
            alert('Hero section updated successfully!');
        } catch (error) {
            console.error('Error saving hero:', error);
            alert('Failed to save changes');
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

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Hero Section Management
                </h1>
                <p className="text-gray-600">Update your homepage hero content</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl shadow-xl p-8"
            >
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hero Title
                        </label>
                        <input
                            type="text"
                            value={hero.title}
                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                            placeholder="Your vision, our solution"
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subtitle
                        </label>
                        <input
                            type="text"
                            value={hero.subtitle}
                            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                            placeholder="360 degree marketing solution provider"
                        />
                    </div>

                    {/* CTA Text */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Call-to-Action Button Text
                        </label>
                        <input
                            type="text"
                            value={hero.cta_text}
                            onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                            placeholder="Get Started"
                        />
                    </div>

                    {/* CTA Link */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Call-to-Action Link
                        </label>
                        <input
                            type="text"
                            value={hero.cta_link}
                            onChange={(e) => setHero({ ...hero, cta_link: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                            placeholder="/contact-us"
                        />
                    </div>

                    {/* Background Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Background Image Path
                        </label>
                        <input
                            type="text"
                            value={hero.background_image}
                            onChange={(e) => setHero({ ...hero, background_image: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                            placeholder="/assets/all-images/5-1.png"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
