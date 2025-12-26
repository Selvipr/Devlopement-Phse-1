// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FaCreditCard, FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../lib/supabase';


export default function Checkout() {
  const { cartItems, getCartTotal, clearCart, addToCart } = useCart();
  const { t, formatPrice } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card'
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle buy now functionality
  useEffect(() => {
    const state = location.state;
    if (state && state.buyNow && state.product) {
      // For buy now, clear existing cart and add the product
      clearCart();
      addToCart(state.product);
    }
  }, [location.state, addToCart, clearCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zipCode) newErrors.zipCode = 'Zip code is required';
    if (!formData.country) newErrors.country = 'Country is required';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card number';

      if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      else if (formData.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      navigate('/cart');
      return;
    }

    setIsProcessing(true);

    try {
      // Create a timeout promise to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 15000)
      );

      // 1. Create Order in Supabase
      // We wrap the Supabase/DB calls in a promise to race against the timeout
      const createOrderPromise = async () => {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              // Link to the authenticated user if they are logged in
              user_id: user?.id || null,
              guest_email: formData.email,
              total_amount: total,
              status: 'pending',
              payment_status: 'paid', // Simulating successful payment
              payment_method: formData.paymentMethod,
              shipping_address: formData
            }
          ])
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Create Order Items
        const orderItemsData = cartItems.map(item => ({
          order_id: orderData.id,
          // If you have a products table, use item.id -> product_id
          // For now, keeping product_id null as per your schema preference or use item.id if ready
          product_id: item.id || null,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          player_id: item.playerId || null,
          server_id: item.serverId || null
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsData);

        if (itemsError) throw itemsError;

        return orderData;
      };

      // Race the order creation against the timeout
      const orderData = await Promise.race([createOrderPromise(), timeoutPromise]);

      // Success
      clearCart();
      navigate('/orders', {
        state: {
          orderSuccess: true,
          orderNumber: `ORD-${orderData.id}`
        }
      });

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order: ' + (error.message || 'Unknown error'));
    } finally {
      // ALWAYS stop the loading spinner, whether success or fail
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const delivery = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center max-w-lg">
          <div className="text-9xl mb-6 opacity-30 text-gray-500"><FaArrowLeft className="inline-block" /></div>
          <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 text-lg mb-8">Add some products to your cart before checkout</p>
          <button onClick={() => navigate('/products')} className="px-8 py-3 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-white/10 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Checkout</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
            Home
          </button>
          <button onClick={() => navigate('/products')} className="text-gray-400 hover:text-white transition-colors">
            Products
          </button>
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <FaArrowLeft /> {t('continueShopping') || "Back to Cart"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className={`w-full bg-primary/50 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                    />
                    {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      className={`w-full bg-primary/50 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                    />
                    {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Billing Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full bg-primary/50 border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                    />
                    {errors.fullName && <span className="text-xs text-red-500">{errors.fullName}</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className={`w-full bg-primary/50 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                    />
                    {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className={`w-full bg-primary/50 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                      />
                      {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Zip Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className={`w-full bg-primary/50 border ${errors.zipCode ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                      />
                      {errors.zipCode && <span className="text-xs text-red-500">{errors.zipCode}</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full bg-primary/50 border ${errors.country ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="RU">Russia</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                    {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'bg-accent/10 border-accent text-white' : 'bg-primary/30 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="text-accent focus:ring-accent"
                    />
                    <FaCreditCard /> Credit/Debit Card
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'paypal' ? 'bg-accent/10 border-accent text-white' : 'bg-primary/30 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="text-accent focus:ring-accent"
                    />
                    <span>PayPal</span>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="bg-primary/30 p-6 rounded-xl border border-white/10 space-y-4 mt-4 animate-fadeIn">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`w-full bg-surface border ${errors.cardNumber ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                      />
                      {errors.cardNumber && <span className="text-xs text-red-500">{errors.cardNumber}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="JOHN DOE"
                        className={`w-full bg-surface border ${errors.cardName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                      />
                      {errors.cardName && <span className="text-xs text-red-500">{errors.cardName}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          className={`w-full bg-surface border ${errors.expiryDate ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                        />
                        {errors.expiryDate && <span className="text-xs text-red-500">{errors.expiryDate}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength="4"
                          className={`w-full bg-surface border ${errors.cvv ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors`}
                        />
                        {errors.cvv && <span className="text-xs text-red-500">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <div className="pt-6">
                <button type="submit" disabled={isProcessing} className="w-full bg-gradient-to-r from-accent to-blue-600 hover:from-accent-hover hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg">
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock /> Place Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[400px] flex-shrink-0">
          <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-dashed border-white/10">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                  <div className="flex-grow">
                    <div className="text-white font-medium">{item.name}</div>
                    <div className="text-gray-400">x{item.quantity}</div>
                  </div>
                  <div className="text-white font-medium">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-dashed border-white/10">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'text-emerald-400' : 'text-white'}>
                  {delivery === 0 ? t('free') : formatPrice(delivery)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10 mt-4">
                <span className="text-white">Total</span>
                <span className="text-accent">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 bg-white/5 p-3 rounded-lg">
              <FaLock />
              <span>Secure checkout with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

