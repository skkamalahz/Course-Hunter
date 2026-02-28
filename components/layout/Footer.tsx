import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

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
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
                            Course Hunter
                        </h3>
                        <p className="text-gray-300 mb-4">
                            360 degree marketing solution provider
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-primary-600 transition-colors duration-300"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <Mail size={20} className="text-primary-400 mt-1" />
                                <a href="mailto:info@coursehunter.com" className="text-gray-300 hover:text-primary-400">
                                    info@coursehunter.com
                                </a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Phone size={20} className="text-primary-400 mt-1" />
                                <a href="tel:+15551234567" className="text-gray-300 hover:text-primary-400">
                                    +1 (555) 123-4567
                                </a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin size={20} className="text-primary-400 mt-1" />
                                <span className="text-gray-300">
                                    123 Marketing Street<br />Digital City, DC 12345
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                        <p className="text-gray-300 mb-4">
                            Subscribe to get the latest updates and news.
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg hover:opacity-90 transition-opacity font-medium"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Course Hunter. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
