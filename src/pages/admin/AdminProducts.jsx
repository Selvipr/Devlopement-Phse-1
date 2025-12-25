// src/pages/admin/AdminProducts.jsx
import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaGamepad } from 'react-icons/fa';

export default function AdminProducts() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const [products] = useState([
        { id: 1, name: "Free Fire 100 Diamonds", category: "Game Top-up", price: 1.20, stock: 9999, status: "Active" },
        { id: 2, name: "PUBG 60 UC", category: "Game Top-up", price: 0.99, stock: 5000, status: "Active" },
        { id: 3, name: "Steam Wallet $10", category: "Gift Card", price: 10.00, stock: 50, status: "Active" },
        { id: 4, name: "Netflix $30", category: "Gift Card", price: 30.00, stock: 25, status: "Active" },
        { id: 5, name: "Garena Shells 100", category: "Game Top-up", price: 1.50, stock: 0, status: "Out of Stock" },
    ]);

    return (
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <FaGamepad className="mr-2 text-accent" /> Product Management
                </h2>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-accent hover:bg-accent-hover text-primary font-bold px-6 py-2.5 rounded-xl flex items-center transition-colors">
                        <FaPlus className="mr-2" /> Add Product
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm uppercase">
                            <th className="py-4 px-4">Product Name</th>
                            <th className="py-4 px-4">Category</th>
                            <th className="py-4 px-4">Price</th>
                            <th className="py-4 px-4">Stock</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4 font-medium text-white">{product.name}</td>
                                <td className="py-4 px-4">
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/20">{product.category}</span>
                                </td>
                                <td className="py-4 px-4 font-bold text-accent">${product.price.toFixed(2)}</td>
                                <td className="py-4 px-4">{product.stock}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded text-xs border ${product.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button className="p-2 text-blue-400 hover:text-white hover:bg-blue-500 rounded-lg transition-colors mr-2">
                                        <FaEdit />
                                    </button>
                                    <button className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
                Showing {products.length} products
            </div>
        </div>
    );
}
