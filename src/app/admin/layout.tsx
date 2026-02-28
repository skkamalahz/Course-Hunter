'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    Settings,
    Images,
    LogOut,
    Image as ImageIcon,
    Handshake,
    Menu,
    X
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hero Section', href: '/admin/hero', icon: ImageIcon },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Portfolio', href: '/admin/work', icon: FileText },
    { name: 'Careers', href: '/admin/careers', icon: Briefcase },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Clients', href: '/admin/clients', icon: Handshake },
    { name: 'Gallery', href: '/admin/content-gallery', icon: Images },
    { name: 'Global Content', href: '/admin/content', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        if (!isAuthenticated && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [pathname, router]);

    if (pathname === '/admin/login') {
        return children;
    }

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-slate-900 text-white
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                            Admin Panel
                        </h2>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X size={24} /></button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${isActive
                                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600"><Menu size={24} /></button>
                    <span className="ml-4 font-bold text-gray-800">Admin Panel</span>
                </header>
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
