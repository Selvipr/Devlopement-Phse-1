// src/pages/admin/AdminOrders.jsx
import React, { useState } from 'react';
import { FaSearch, FaEye, FaCheck, FaTimes, FaFilter } from 'react-icons/fa';

export default function AdminOrders() {
    const [filter, setFilter] = useState('All');

    // Mock Data
    const orders = [
        { id: "ORD-001", user: "john@example.com", item: "Free Fire 100 Diamonds", amount: "$1.20", status: "Completed", date: "2023-10-25" },
        { id: "ORD-002", user: "gamer123@test.com", item: "PUBG 60 UC", amount: "$0.99", status: "Pending", date: "2023-10-26" },
        { id: "ORD-003", user: "alex@domain.com", item: "Steam Wallet $50", amount: "$50.00", status: "Processing", date: "2023-10-26" },
    ];

    return (
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Order Management</h2>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                        {['All', 'Pending', 'Completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status ? 'bg-accent text-primary shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 md:w-64">
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm uppercase">
                            <th className="py-4 px-4">Order ID</th>
                            <th className="py-4 px-4">User</th>
                            <th className="py-4 px-4">Item</th>
                            <th className="py-4 px-4">Amount</th>
                            <th className="py-4 px-4">Date</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4 font-mono text-accent">{order.id}</td>
                                <td className="py-4 px-4 text-white">{order.user}</td>
                                <td className="py-4 px-4">{order.item}</td>
                                <td className="py-4 px-4 font-bold">${order.amount.replace('$', '')}</td>
                                <td className="py-4 px-4 text-sm text-gray-500">{order.date}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded text-xs border ${order.status === 'Completed' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                            order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                                                'bg-blue-500/20 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right flex justify-end gap-2">
                                    <button title="View Details" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                        <FaEye />
                                    </button>
                                    {order.status !== 'Completed' && (
                                        <button title="Mark Completed" className="p-2 text-green-400 hover:text-white hover:bg-green-500 rounded-lg transition-colors">
                                            <FaCheck />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
