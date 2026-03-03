'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Layout, Info, Mail, Image as ImageIcon, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminContentPage() {
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null); // Stores pageId being uploaded

    // Form states
    const [homeData, setHomeData] = useState({ title: '', subtitle: '', cta_text: '' });
    const [aboutData, setAboutData] = useState({ title: '', mission: '', vision: '', story: '' });
    const [contactData, setContactData] = useState({ email: '', phone: '', address: '' });
    const [bannerData, setBannerData] = useState<Record<string, { id: string, title: string, subtitle: string, background_image?: string | null }>>({});

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [heroRes, aboutRes, contactRes, bannersRes] = await Promise.all([
                supabase.from('hero_settings').select('*').eq('id', 'hero_001').single(),
                supabase.from('about_settings').select('*').eq('id', 'about_001').single(),
                supabase.from('contact_settings').select('*').eq('id', 'contact_001').single(),
                supabase.from('page_headers').select('*')
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
            if (bannersRes.data) {
                const banners: Record<string, { id: string, title: string, subtitle: string, background_image?: string | null }> = {};
                bannersRes.data.forEach((b: any) => {
                    // Map by pageId patterns
                    let pageId = '';
                    if (b.page_path === '/services') pageId = 'services';
                    else if (b.page_path === '/our-team') pageId = 'team';
                    else if (b.page_path === '/our-work') pageId = 'work';
                    else if (b.page_path === '/gallery') pageId = 'gallery';
                    else if (b.page_path === '/career') pageId = 'career';
                    else if (b.page_path === '/about-us') pageId = 'about';

                    if (pageId) {
                        banners[pageId] = {
                            id: b.id,
                            title: b.title,
                            subtitle: b.subtitle,
                            background_image: b.background_image
                        };
                    }
                });
                setBannerData(banners);
            }
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, pageId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(pageId);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `banner-photos/${fileName}`;

            // Try to upload to 'banner-images' bucket, fallback to 'gallery-images' if it fails
            let bucketName = 'banner-images';
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    contentType: file.type || 'image/webp'
                });

            if (uploadError) {
                console.warn('Failed to upload to banner-images, trying gallery-images...');
                bucketName = 'gallery-images';
                const { error: fallbackError } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file, {
                        contentType: file.type || 'image/webp'
                    });
                if (fallbackError) throw fallbackError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            setBannerData(prev => ({
                ...prev,
                [pageId]: { ...prev[pageId], background_image: publicUrl }
            }));
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + (error.message || 'Check storage permissions.'));
        } finally {
            setUploading(null);
        }
    };

    const handleSaveBanner = async (pageId: string) => {
        setSaving(true);
        const banner = bannerData[pageId];
        if (!banner?.id) {
            alert('Banner data not found for this page.');
            setSaving(false);
            return;
        }

        try {
            console.log(`Attempting to update banner for ${pageId} with ID: ${banner.id}`);
            const { error, data } = await supabase
                .from('page_headers')
                .update({
                    title: banner.title.trim(),
                    subtitle: banner.subtitle.trim(),
                    background_image: banner.background_image?.trim() || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', banner.id)
                .select();

            if (error) throw error;
            console.log('Update result:', data);

            if (!data || data.length === 0) {
                throw new Error('No rows were updated. This might be due to database permissions or an invalid record ID.');
            }

            alert(`${pageId.charAt(0).toUpperCase() + pageId.slice(1)} banner updated successfully!`);
            // Immediate local state sync before global fetch
            if (data && data[0]) {
                setBannerData(prev => ({
                    ...prev,
                    [pageId]: {
                        ...prev[pageId],
                        title: data[0].title,
                        subtitle: data[0].subtitle,
                        background_image: data[0].background_image
                    }
                }));
            }
            fetchAllData();
        } catch (error: any) {
            console.error('Save failed:', error);
            alert(`Save failed: ${error.message || 'Unknown error'}`);
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
        { id: 'banners', label: 'Page Banners', icon: ImageIcon },
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

                {activeTab === 'banners' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Page Banners Management</h2>
                        <div className="grid grid-cols-1 gap-12">
                            {['services', 'team', 'work', 'gallery', 'career', 'about'].map((pageId) => (
                                <div key={pageId} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                    <h3 className="text-lg font-bold text-primary-600 uppercase tracking-wider">
                                        {pageId === 'work' ? 'Our Work' : pageId === 'team' ? 'Our Team' : pageId.charAt(0).toUpperCase() + pageId.slice(1)}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={bannerData[pageId]?.title || ''}
                                                onChange={(e) => setBannerData({
                                                    ...bannerData,
                                                    [pageId]: { ...bannerData[pageId], title: e.target.value }
                                                })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none bg-white transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                                            <textarea
                                                value={bannerData[pageId]?.subtitle || ''}
                                                onChange={(e) => setBannerData({
                                                    ...bannerData,
                                                    [pageId]: { ...bannerData[pageId], subtitle: e.target.value }
                                                })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none bg-white transition-all"
                                                rows={2}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Background Image</label>
                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="relative group w-20 h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-200">
                                                    {bannerData[pageId]?.background_image ? (
                                                        <img src={bannerData[pageId].background_image!} className="w-full h-full object-cover" alt="Preview" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <label className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700">
                                                        {uploading === pageId ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                                                        <span>{uploading === pageId ? 'Uploading...' : 'Upload Image'}</span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*,.webp"
                                                            onChange={(e) => handleImageUpload(e, pageId)}
                                                            disabled={!!uploading}
                                                        />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Or paste direct image URL..."
                                                        value={bannerData[pageId]?.background_image || ''}
                                                        onChange={(e) => setBannerData({
                                                            ...bannerData,
                                                            [pageId]: { ...bannerData[pageId], background_image: e.target.value }
                                                        })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none bg-white transition-all text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-400 italic">Recommended: High resolution landscape image (1920x600px)</p>
                                        </div>
                                        <button
                                            onClick={() => handleSaveBanner(pageId)}
                                            disabled={saving}
                                            className="px-6 py-3 bg-white border border-primary-200 text-primary-700 rounded-xl hover:bg-primary-50 transition-all font-semibold flex items-center space-x-2 disabled:opacity-50"
                                        >
                                            {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                                            <span>Update {pageId.charAt(0).toUpperCase() + pageId.slice(1)} Banner</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
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
