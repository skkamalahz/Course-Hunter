'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, Target, Sparkles, TrendingUp, Palette, Search, Code, PenTool, Share2, Users, Mail, ExternalLink, Briefcase, User, RefreshCw } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

const iconMap: { [key: string]: any } = {
  Target, Sparkles, TrendingUp, Palette, Search, Code, PenTool, Share2, Users, Mail
};

export default function HomePage() {
  const [hero, setHero] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [leadership, setLeadership] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          { data: heroData },
          { data: servicesData },
          { data: teamData },
          { data: catData },
          { data: clientsData },
          { data: portfolioData }
        ] = await Promise.all([
          supabase.from('hero_settings').select('*').single(),
          supabase.from('services').select('*').order('order_index'),
          supabase.from('team_members').select('*').order('order_index'),
          supabase.from('team_categories').select('*').order('order_index'),
          supabase.from('clients').select('*').order('order_index'),
          supabase.from('portfolio_items').select('*').order('order_index').limit(3)
        ]);

        if (heroData) setHero(heroData);
        if (servicesData) setServices(servicesData);
        if (teamData && catData) {
          // Identify leadership category (usually the first one, or 'Founder')
          const leaderCat = catData.find(c => c.name === 'Founder' || c.name === 'Founders' || c.order_index === 0);
          const leaderList = teamData.filter(m => m.category === leaderCat?.name);
          setLeadership(leaderList.length > 0 ? leaderList : teamData.slice(0, 3));
        }
        if (clientsData) setClients(clientsData);
        if (portfolioData) setPortfolio(portfolioData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <RefreshCw className="animate-spin text-primary-500" size={48} />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <Image
              src={hero?.background_image || "/assets/all-images/5-1.png"}
              alt="Banner Background"
              fill
              className="object-cover"
              style={{ filter: 'blur(3px)', transform: 'scale(1.1)' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-primary-500/40 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-primary-500/20 z-10"></div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
                <span className="text-white block">
                  {hero?.title.split(',')[0] || 'Digital'},
                </span>
                <span className="text-accent-500 block mt-2">
                  {hero?.title.split(',')[1]?.trim() || 'Marketing Solutions'}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl leading-relaxed mx-auto">
                {hero?.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={hero?.cta_link || '/contact-us'}
                  className="inline-flex items-center justify-center space-x-3 px-10 py-5 bg-primary-500 text-white rounded-none font-bold hover:bg-primary-600 transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  <span>{hero?.cta_text || 'Get Started'}</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center space-x-3 px-10 py-5 border border-accent-500 text-white rounded-none font-bold hover:bg-accent-500/10 transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  <span>Our Services</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
            </div>
          </div>
        </section>

        {/* Our Clients */}
        {clients.length > 0 && (
          <section className="py-24 bg-white relative overflow-hidden text-center border-y border-gray-100">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-100 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-100 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Our Partners</span>
                <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent uppercase tracking-tight">
                  Trusted by Industry Leaders
                </h2>
              </motion.div>
            </div>

            {/* Infinite Marquee */}
            <div className="relative flex overflow-hidden py-10">
              <motion.div
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
                className="flex flex-none gap-12 pr-12 items-center"
              >
                {[...clients, ...clients].map((client, index) => (
                  <motion.div
                    key={`${client.id}-${index}`}
                    className="flex-none"
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 h-24 w-40 md:h-32 md:w-56 flex items-center justify-center group transition-all duration-500 hover:shadow-primary-500/10 hover:border-primary-500/20">
                      {client.logo_url ? (
                        <img
                          src={client.logo_url}
                          alt={client.name}
                          className="max-h-full max-w-full object-contain grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                        />
                      ) : (
                        <span className="text-lg md:text-xl font-black text-gray-300 group-hover:text-primary-600 transition-colors uppercase tracking-widest leading-none">
                          {client.name}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Fade Overlays */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
            </div>
          </section>
        )}

        {/* Services Overview */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Our Services</h2>
              <div className="h-1.5 w-20 bg-primary-500 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">Providing end-to-end marketing solutions tailored to your business needs.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || Code;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-500 transition-colors duration-300">
                      <Icon className="text-primary-600 group-hover:text-white transition-colors duration-300" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <Link href="/services" className="text-primary-600 font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                      Learn More <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest Work Preview */}
        {portfolio.length > 0 && (
          <section className="py-24 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-tighter">Latest Work</h2>
                  <div className="h-1.5 w-20 bg-accent-500 mb-6"></div>
                  <p className="text-gray-400 max-w-2xl">Handpicked projects that showcase our expertise and impact.</p>
                </div>
                <Link href="/our-work" className="hidden md:flex items-center space-x-2 text-accent-500 font-bold group">
                  <span>View All Projects</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {portfolio.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-900 to-black flex items-center justify-center">
                          <Briefcase className="text-primary-500/20" size={64} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Link href={project.link || '#'} className="p-4 bg-white rounded-full text-primary-900">
                          <ExternalLink size={24} />
                        </Link>
                      </div>
                    </div>
                    <span className="text-accent-500 font-bold text-sm uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-2xl font-bold mt-2 group-hover:text-accent-500 transition-colors uppercase tracking-tight">{project.title}</h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Meet the Leadership */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Meet the Leadership</h2>
            <div className="h-1.5 w-20 bg-primary-500 mx-auto mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="p-10 bg-white rounded-[2.5rem] shadow-xl flex flex-col h-full hover:shadow-2xl transition-all border border-gray-100 group"
                >
                  <div className="aspect-square bg-gray-50 rounded-[2rem] mb-8 overflow-hidden flex items-center justify-center border-2 border-primary-50 group-hover:border-primary-100 transition-all">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <User className="text-gray-200" size={64} />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-1 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{member.name}</h3>
                  <p className="text-primary-600 font-bold mb-6 uppercase text-xs tracking-widest">{member.role}</p>
                  <p className="text-gray-500 flex-grow text-sm leading-relaxed font-medium line-clamp-4">{member.bio}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-16">
              <Link href="/our-team" className="inline-flex items-center space-x-3 px-10 py-5 bg-gray-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-primary-600 transition-all shadow-xl">
                <span>View Full Team</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
