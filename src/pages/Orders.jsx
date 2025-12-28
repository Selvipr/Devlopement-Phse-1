import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBoxOpen,
  FaSearch,
  FaChevronDown,
  FaMapMarkerAlt
} from 'react-icons/fa';

const PAGE_SIZE = 5;

export default function Orders() {
  const { t, formatPrice } = useLanguage();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');

  const orderSuccess = location.state?.orderSuccess;
  const newOrderNumber = location.state?.orderNumber;

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    try {
      setLoading(true);
      setError(null);

      // Get range for pagination
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Base query
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              image_url
            )
          )
        `, { count: 'exact' })
        .eq('user_id', user.id);

      // Apply Search logic
      if (searchQuery) {
        if (!isNaN(searchQuery)) {
          query = query.or(`id.eq.${searchQuery},total_amount.eq.${searchQuery}`);
        } else {
          query = query.or(`status.ilike.%${searchQuery}%,payment_status.ilike.%${searchQuery}%`);
        }
      }

      // Apply Tab filters
      if (activeTab === 'cancelled') {
        query = query.eq('status', 'cancelled');
      } else if (activeTab === 'not yet shipped') {
        query = query.in('status', ['pending', 'processing']);
      } else if (activeTab === 'buy again') {
        query = query.eq('status', 'completed');
      }

      // Apply ordering and pagination
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (isMounted) {
        setOrders(data || []);
        setTotalCount(count || 0);
      }

    } catch (err) {
      console.error('Error fetching orders:', err);
      if (isMounted) {
        setError(err.message || 'Failed to load orders. Please try again.');
        // If it's a specific "query.or is not a function" error, it implies Mock Client usage or bad version
        if (err.message && err.message.includes('not a function')) {
          setError('System Error: Database client initialization failed. Please check configuration.');
        }
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [user, page, searchQuery, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [user, page, fetchOrders]); // fetchOrders is now a dependency due to useCallback

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 on search change
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchOrders]); // fetchOrders is a dependency here too

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleBuyAgain = (item) => {
    // Construct product object from order item
    const product = {
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      // Add other necessary fields if available or defaults
    };
    addToCart(product);
    navigate('/cart');
  };

  if (!user && !orderSuccess) {
    return (
      <div className="min-h-screen pt-32 px-4 pb-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t?.loginToViewOrders || "Please log in to view your orders"}
          </h2>
          <Link
            to="/login"
            className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] rounded-lg py-2 px-6 text-sm font-medium shadow-sm transition-colors"
          >
            {t?.login || "Login"}
          </Link>
        </div>
      </div>
    );
  }

  // If we are here, we either have a user OR we have a guest just placed an order
  // If guest, hide the order history list and just show success? Or try to show the order they just placed?
  // Current logic in fetchOrders depends on user.email. If guest, we might want to fetch by ID using some other auth?
  // For now, let's just make sure the UI renders so they see the success message.

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
      <div className="max-w-[1000px] mx-auto">

        {/* Breadcrumb / Title */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-normal text-gray-900 dark:text-gray-100">Your Orders</h1>

            {/* Search Bar for Orders */}
            <div className="hidden md:flex flex-grow max-w-md ml-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Order ID"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={fetchOrders}
                className="ml-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* New Order Success Message */}
          {orderSuccess && newOrderNumber && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    <span className="font-bold">Order placed!</span> {t?.orderConfirmationMessage?.replace('{orderNumber}', newOrderNumber) || `Order #${newOrderNumber}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab.toLowerCase()); setPage(1); }}
                  className={`
                    whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.toLowerCase()
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{totalCount} orders placed in</span>
            <select className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm rounded px-2 py-1 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
              <option>past 3 months</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-48 animate-pulse">
                <div className="h-14 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 rounded-t-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10 bg-white dark:bg-gray-800 border border-red-100 rounded-lg">
            <p>{error}</p>
            <button onClick={fetchOrders} className="mt-4 text-primary underline">Try Again</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-10 text-center">
            <FaBoxOpen className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
            <p className="text-gray-500 mt-1">Looks like you haven't placed any orders yet.</p>
            <Link to="/" className="mt-4 inline-block bg-[#FFD814] hover:bg-[#F7CA00] text-black py-2 px-6 rounded-lg text-sm font-medium shadow-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group"
              >
                {/* Order Header */}
                <div className="bg-[#f6f6f6] dark:bg-gray-700/50 px-6 py-4 flex flex-wrap md:flex-nowrap justify-between items-start md:items-center text-sm gap-4 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                  <div className="flex flex-wrap gap-8">
                    <div className="flex flex-col">
                      <span className="uppercase text-xs font-medium">Order Placed</span>
                      <span className="text-gray-900 dark:text-white">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase text-xs font-medium">Total</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatPrice ? formatPrice(order.total_amount) : `$${order.total_amount}`}
                      </span>
                    </div>
                    <div className="flex flex-col relative group/ship">
                      <span className="uppercase text-xs font-medium">Ship To</span>
                      <div className="text-link text-blue-600 dark:text-blue-400 cursor-pointer flex items-center">
                        <span className="truncate max-w-[150px]">
                          {order.shipping_address?.fullName || user.email}
                        </span>
                        <FaChevronDown className="ml-1 text-xs" />
                      </div>

                      {/* Shipping Popover */}
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-600 rounded-lg p-3 hidden group-hover/ship:block z-10 text-sm">
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          {order.shipping_address?.fullName || "Guest User"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.shipping_address?.address}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.shipping_address?.city}, {order.shipping_address?.zipCode}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.shipping_address?.country}
                        </p>
                        {order.shipping_address?.phone && (
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Phone: {order.shipping_address.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-xs font-medium">Order #</span>
                      <span className="text-gray-900 dark:text-white">{order.id}</span>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline hover:text-red-700">View order details</Link>
                      <span className="border-l border-gray-300 dark:border-gray-600 h-4"></span>
                      <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline hover:text-red-700">Invoice</Link>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Status & Delivery Info */}
                    <div className="flex-grow space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {order.status === 'completed' ? (
                          <span className="text-green-700 dark:text-green-400">Delivered {new Date(order.created_at).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-orange-600 dark:text-orange-400">Arriving Soon</span>
                        )}
                      </h3>

                      {order.order_items && order.order_items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                            {item.products?.image_url ? (
                              <img src={item.products.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                            ) : (
                              <FaBoxOpen className="text-3xl text-gray-400" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <Link to={`/product/${item.product_id || '#'}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline hover:text-red-700 text-base line-clamp-2">
                              {item.product_name}
                            </Link>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.server_id && <span className="mr-2">Server: {item.server_id}</span>}
                              {item.player_id && <span>Player ID: {item.player_id}</span>}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Return window closed on {new Date(new Date(order.created_at).setDate(new Date(order.created_at).getDate() + 30)).toLocaleDateString()}
                            </div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white mt-2">
                              {formatPrice ? formatPrice(item.price) : `$${item.price}`} <span className="text-gray-500 font-normal">x {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons Column */}
                    <div className="md:w-64 flex-shrink-0 flex flex-col gap-3">
                      <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] rounded-lg py-2 shadow-sm text-sm font-medium transition-colors">
                        Track package
                      </button>
                      <button className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg py-1.5 shadow-sm text-sm font-medium transition-colors">
                        Make a Review
                      </button>
                      <button
                        onClick={() => handleBuyAgain(order.order_items[0])} // Simplification: just buy the first item or logic to show modal
                        className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg py-1.5 shadow-sm text-sm font-medium transition-colors"
                      >
                        Buy it again
                      </button>
                    </div>
                  </div>
                </div>

                {/* Archive / Footer of card */}
                <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-3 bg-white dark:bg-gray-800">
                  <Link to="#" className="text-blue-600 dark:text-blue-400 text-sm hover:underline hover:text-red-700">Archive Order</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`
                     px-3 py-1 rounded-md border text-sm font-medium transition-colors
                     ${page === i + 1
                      ? 'bg-gray-800 text-white border-gray-800 dark:bg-white dark:text-black dark:border-white'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}
                   `}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </nav>
          </div>
        )}

      </div>
    </div>
  );
}