// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaClipboardList, FaUsers, FaSignOutAlt, FaGamepad } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard' },
        { path: '/admin/products', icon: FaBox, label: 'Products' },
        { path: '/admin/orders', icon: FaClipboardList, label: 'Orders' },
        { path: '/admin/users', icon: FaUsers, label: 'Users' },
    ];

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-primary-dark">
            {/* Sidebar */}
            <div className="w-64 bg-surface border-r border-white/5 flex flex-col">
                <div className="p-6 flex items-center space-x-3 border-b border-white/5">
                    <div className="p-2 bg-accent rounded-lg">
                        <FaGamepad className="text-xl text-primary" />
                    </div>
                    <span className="text-xl font-bold text-white">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                                ? 'bg-accent text-primary font-bold shadow-lg shadow-accent/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-surface border-b border-white/5 p-6 sticky top-0 z-30 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                        {menuItems.find(i => i.path === location.pathname)?.label || 'Admin'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">Admin User</p>
                            <p className="text-xs text-gray-400">admin@digitalmarket.com</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                    </div>
                </header>
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
