// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { FaShoppingCart, FaDollarSign, FaUsers, FaBoxOpen } from 'react-icons/fa';

export default function AdminDashboard() {
    const stats = [
        { label: "Total Sales", value: "$12,450", icon: FaDollarSign, color: "bg-green-500" },
        { label: "Total Orders", value: "1,240", icon: FaShoppingCart, color: "bg-blue-500" },
        { label: "Active Users", value: "850", icon: FaUsers, color: "bg-purple-500" },
        { label: "Products", value: "45", icon: FaBoxOpen, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-surface border border-white/5 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
                        <div className={`p-4 rounded-xl ${stat.color} bg-opacity-20 text-${stat.color.replace('bg-', '')}`}>
                            <stat.icon className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-surface border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Orders</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                                <div>
                                    <p className="font-bold text-white">Order #100{i}</p>
                                    <p className="text-xs text-gray-400">2 mins ago</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-accent">$50.00</p>
                                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Completed</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-gray-400 hover:text-white transition-colors">View All Orders</button>
                </div>

                {/* Popular Products */}
                <div className="bg-surface border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Top Selling Products</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Free Fire 100 Diamonds", sales: 450 },
                            { name: "PUBG 60 UC", sales: 320 },
                            { name: "Steam Wallet $10", sales: 210 },
                            { name: "Netflix Gift Card", sales: 150 },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs text-white">{i + 1}</div>
                                    <span className="font-medium text-white">{item.name}</span>
                                </div>
                                <span className="font-bold text-gray-400">{item.sales} sold</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
