import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCheck, FaTimes, FaFilter } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Fetch all orders with user profile info if possible, or just orders
            // Note: We need to enable RLS policy for Admin to see all orders
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items (
                        product_name,
                        price,
                        quantity
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching admin orders:', error);
            alert('Error loading orders. Ensure you have Admin permissions.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Mark order #${orderId} as ${newStatus}?`)) return;

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'All' ||
            (filter === 'Pending' && order.status === 'pending') ||
            (filter === 'Completed' && order.status === 'completed');

        const matchesSearch =
            order.item?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            <th className="py-4 px-4">User / Email</th>
                            <th className="py-4 px-4">Items</th>
                            <th className="py-4 px-4">Amount</th>
                            <th className="py-4 px-4">Date</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-10">Loading orders...</td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-10">No orders found</td></tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 font-mono text-accent">{order.id}</td>
                                    <td className="py-4 px-4 text-white">
                                        <div className="flex flex-col">
                                            <span>{order.guest_email || 'Registered User'}</span>
                                            <span className="text-xs text-gray-500">{order.user_id}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="line-clamp-1" title={order.items?.map(i => i.product_name).join(', ')}>
                                            {order.items?.length > 0 ? `${order.items[0].product_name} ${order.items.length > 1 ? `+${order.items.length - 1} more` : ''}` : 'No items'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 font-bold">${order.total_amount}</td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded text-xs border uppercase font-bold 
                                            ${order.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                                order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                                                    'bg-blue-500/20 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right flex justify-end gap-2">
                                        <button title="View Details" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                            <FaEye />
                                        </button>
                                        {order.status !== 'completed' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'completed')}
                                                title="Mark Completed"
                                                className="p-2 text-green-400 hover:text-white hover:bg-green-500 rounded-lg transition-colors"
                                            >
                                                <FaCheck />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
