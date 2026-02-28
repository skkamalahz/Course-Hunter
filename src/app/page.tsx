'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, Target, Sparkles, TrendingUp, Palette, Search, Code, PenTool, Share2, Users, FileText, Mail, ExternalLink, Briefcase } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase';

const iconMap: { [key: string]: any } = {
  Target, Sparkles, TrendingUp, Palette, Search, Code, PenTool, Share2, Users, FileText, Mail
};

export default function HomePage() {
  const [hero, setHero] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
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
          { data: clientsData },
          { data: portfolioData }
        ] = await Promise.all([
          supabase.from('hero_settings').select('*').single(),
          supabase.from('services').select('*').order('order_index'),
          supabase.from('team_members').select('*').order('order_index'),
          supabase.from('clients').select('*').order('order_index'),
          supabase.from('portfolio_items').select('*').order('order_index').limit(3)
        ]);

        if (heroData) setHero(heroData);
        if (servicesData) setServices(servicesData);
        if (teamData) setTeam(teamData);
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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
                  {hero?.title.split(',')[0]},
                </span>
                <span className="text-accent-500 block mt-2">
                  {hero?.title.split(',')[1]?.trim() || 'our solution'}
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
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              >
                Our clients
              </motion.h2>
              <div className="flex flex-wrap justify-center gap-12 items-center">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-2xl font-bold text-gray-400 grayscale hover:grayscale-0 transition-all duration-300">{client.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Services Overview */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
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
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Latest Work</h2>
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
                    <h3 className="text-2xl font-bold mt-2 group-hover:text-accent-500 transition-colors">{project.title}</h3>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 text-center md:hidden">
                <Link href="/our-work" className="inline-flex items-center space-x-2 text-accent-500 font-bold">
                  <span>View All Projects</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Meet the Founders */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">Meet the Founders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="p-6 bg-white rounded-3xl shadow-xl flex flex-col h-full"
                >
                  <div className="aspect-square bg-gray-100 rounded-2xl mb-6 flex items-center justify-center">
                    <Users className="text-gray-300" size={64} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 flex-grow">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
