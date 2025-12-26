// src/pages/Cart.jsx - Updated with safe price handling
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FaTrash, FaPlus, FaMinus, FaHeart, FaArrowLeft, FaShieldAlt, FaCreditCard, FaTruck, FaCheckCircle } from 'react-icons/fa';


export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getItemCount,
    clearCart
  } = useCart();

  const { t, formatPrice } = useLanguage();
  const navigate = useNavigate();
  const [savedForLater, setSavedForLater] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Debug cart items
  useEffect(() => {
    console.log('Cart Items Debug:', cartItems);
    cartItems.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        name: item.name,
        price: item.price,
        type: typeof item.price,
        priceNumber: Number(item.price)
      });
    });
  }, [cartItems]);

  // Safe price formatter
  const safeFormatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) {
      console.error('Invalid price:', price);
      return '$0.00';
    }
    return formatPrice(numPrice);
  };

  // Coupon codes with discounts
  const coupons = [
    { code: 'WELCOME10', discount: 10, minOrder: 50 },
    { code: 'GAMING20', discount: 20, minOrder: 100 },
    { code: 'FESTIVE25', discount: 25, minOrder: 150 }
  ];

  const handleQuantityChange = (id, change) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) {
        updateQuantity(id, newQuantity);
      }
    }
  };

  const handleSaveForLater = (item) => {
    removeFromCart(item.id);
    setSavedForLater([...savedForLater, item]);
  };

  const handleMoveToCart = (item) => {
    setSavedForLater(savedForLater.filter(i => i.id !== item.id));
    // Note: We need to add to cart here
    // You might need to update your CartContext to have an addToCart function
    console.log('Move to cart:', item);
  };

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      const total = getCartTotal();
      if (total >= coupon.minOrder) {
        setAppliedCoupon(coupon);
        alert(`✅ Coupon applied! ${coupon.discount}% discount`);
      } else {
        alert(`Minimum order of ${safeFormatPrice(coupon.minOrder)} required for this coupon`);
      }
    } else {
      alert('Invalid coupon code');
    }
    setCouponCode('');
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const total = getCartTotal();
    return (total * appliedCoupon.discount) / 100;
  };

  const calculateDelivery = () => {
    return getCartTotal() > 100 ? 0 : 9.99;
  };

  const grandTotal = getCartTotal() - calculateDiscount() + calculateDelivery();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout', {
      state: {
        cartItems,
        total: grandTotal,
        discount: calculateDiscount(),
        delivery: calculateDelivery()
      }
    });
  };

  if (cartItems.length === 0 && savedForLater.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center max-w-lg">
          <div className="text-9xl mb-6 opacity-30">🛒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 text-lg mb-8">Looks like you haven't added any game codes or cards yet.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
              Start Shopping
            </Link>
          </div>
          <div className="flex justify-center gap-6 mt-12 flex-wrap text-gray-400 text-sm font-medium">
            <div className="flex items-center gap-2"><FaShieldAlt className="text-green-500" /> Safe & Secure</div>
            <div className="flex items-center gap-2"><FaTruck className="text-green-500" /> Instant Delivery</div>
            <div className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Refund Policy</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-white/10 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          {t('shoppingCart')} ({getItemCount()} {getItemCount() === 1 ? t('item') : t('items')})
        </h1>
        <Link to="/products" className="flex items-center gap-2 text-accent hover:text-white font-semibold px-5 py-2.5 rounded-xl border border-accent/30 hover:bg-accent/10 transition-all">
          <FaArrowLeft /> {t('continueShopping')}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Cart Items */}
        <div className="flex-grow space-y-6">
          <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            {cartItems.map(item => {
              const itemPrice = Number(item.price) || 0;
              const originalPrice = item.originalPrice ? Number(item.originalPrice) : null;
              const itemTotal = itemPrice * (item.quantity || 1);

              return (
                <div key={item.id} className="p-6 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Checkbox and Image */}
                    <div className="flex items-center gap-4">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 text-accent focus:ring-accent" />
                      <div className="w-24 h-24 bg-primary/50 rounded-xl border border-white/10 flex items-center justify-center text-4xl shadow-inner">
                        {item.icon || '🎮'}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{item.name || 'Unnamed Item'}</h3>
                          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-lg border border-accent/20">
                            {item.platform || 'Digital'}
                          </span>
                        </div>
                        <div className="text-right sm:hidden">
                          <div className="text-lg font-bold text-white">{safeFormatPrice(itemPrice)}</div>
                          {originalPrice && originalPrice > itemPrice && (
                            <div className="text-sm text-gray-500 line-through">{safeFormatPrice(originalPrice)}</div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mb-4">Sold by: DigitalStore</p>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-primary rounded-lg border border-white/10">
                            <button onClick={() => handleQuantityChange(item.id, -1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-l-lg transition-colors"><FaMinus size={12} /></button>
                            <span className="w-10 text-center font-bold text-white">{item.quantity || 1}</span>
                            <button onClick={() => handleQuantityChange(item.id, 1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-r-lg transition-colors"><FaPlus size={12} /></button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveForLater(item)} className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors" title="Save for later"><FaHeart /></button>
                            <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove"><FaTrash /></button>
                          </div>
                        </div>

                        {/* Desktop Price */}
                        <div className="hidden sm:block text-right">
                          <div className="text-xl font-bold text-white">{safeFormatPrice(itemPrice)}</div>
                          {originalPrice && originalPrice > itemPrice && (
                            <div className="text-sm text-gray-500 line-through">{safeFormatPrice(originalPrice)}</div>
                          )}
                          <div className="text-sm font-medium text-emerald-400 mt-1">Total: {safeFormatPrice(itemTotal)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Clear Cart */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-primary/30 flex justify-end">
                <button onClick={clearCart} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-white hover:bg-red-600 rounded-lg transition-all text-sm font-semibold">
                  <FaTrash /> Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Saved for Later */}
          {savedForLater.length > 0 && (
            <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 pb-4 border-b border-white/10">Saved for Later ({savedForLater.length})</h3>
              <div className="space-y-4">
                {savedForLater.map(item => {
                  const itemPrice = Number(item.price) || 0;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-primary/30 rounded-xl border border-white/5">
                      <div className="w-16 h-16 bg-primary/50 rounded-lg flex items-center justify-center text-2xl">
                        {item.icon || '🎮'}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <div className="text-sm text-gray-500">{item.platform}</div>
                        <div className="font-bold text-accent">{safeFormatPrice(itemPrice)}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleMoveToCart(item)} className="px-4 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-primary text-sm font-bold rounded-lg transition-colors">Move to Cart</button>
                        <button onClick={() => setSavedForLater(savedForLater.filter(i => i.id !== item.id))} className="text-gray-500 hover:text-red-500 text-sm">Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Price Details */}
        <div className="lg:w-[400px] flex-shrink-0">
          <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-dashed border-white/10">{t('priceDetails')}</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>{t('total')} ({getItemCount()} items)</span>
                <span className="font-medium text-white">{safeFormatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>{t('deliveryCharges')}</span>
                <span className={calculateDelivery() === 0 ? 'text-emerald-400' : 'text-white'}>
                  {calculateDelivery() === 0 ? t('free') : safeFormatPrice(calculateDelivery())}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t('discount')} ({appliedCoupon.discount}%)</span>
                  <span className="font-bold">-{safeFormatPrice(calculateDiscount())}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-white">{t('totalAmount')}</span>
                <span className="text-2xl font-bold text-accent">{safeFormatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Savings Message */}
            {((calculateDiscount() > 0) || (calculateDelivery() === 0 && getCartTotal() < 100)) && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 text-sm">
                {calculateDiscount() > 0 && (
                  <div className="text-emerald-400 font-medium mb-1">
                    You will save {safeFormatPrice(calculateDiscount())} on this order!
                  </div>
                )}
                {calculateDelivery() === 0 && getCartTotal() < 100 && (
                  <div className="text-emerald-400">
                    Add {safeFormatPrice(100 - getCartTotal())} more for FREE delivery
                  </div>
                )}
              </div>
            )}

            {/* Coupon Section */}
            <div className="mb-6 pt-6 border-t border-dashed border-white/10">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder={t('enterCouponCode')}
                  className="flex-grow bg-primary/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon} className="bg-accent hover:bg-accent-hover text-primary font-bold px-4 py-2.5 rounded-xl transition-colors">{t('apply')}</button>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center p-3 bg-accent/10 border border-accent/20 rounded-xl mb-3">
                  <span className="text-accent font-bold text-sm">✅ {appliedCoupon.code} applied</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-red-400 hover:text-red-300 text-xs underline">Remove</button>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-2">{t('availableCoupons')}:</p>
                <div className="flex flex-wrap gap-2">
                  {coupons.map(c => (
                    <div key={c.code} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 hover:bg-white/10 cursor-pointer transition-colors" title={`Min order: ${safeFormatPrice(c.minOrder)}`}>
                      <span className="text-accent font-bold">{c.code}</span> - {c.discount}% Off
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleCheckout} disabled={cartItems.length === 0} className="w-full bg-gradient-to-r from-accent to-yellow-500 hover:from-accent-hover hover:to-yellow-600 text-primary font-bold py-4 rounded-xl shadow-xl shadow-accent/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg">
              <FaCreditCard /> {t('placeOrder')}
            </button>

            <div className="mt-6 space-y-3 text-xs text-gray-500">
              <div className="flex items-center gap-2"><FaShieldAlt /> {t('safeSecurePayments')}</div>
              <div className="flex items-center gap-2"><FaTruck /> {t('instantDigitalDelivery')}</div>
              <div className="flex items-center gap-2"><FaCheckCircle /> {t('refundPolicy')}</div>
            </div>

          </div>

          {/* Recommended (Simplified for layout) */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Frequently Bought Together</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-primary/30 rounded-lg hover:bg-primary/50 transition-colors cursor-pointer group">
                <span className="text-2xl">🎧</span>
                <div>
                  <div className="text-sm font-medium text-gray-300 group-hover:text-white">Gaming Headset</div>
                  <div className="text-xs text-accent">+ $49.99</div>
                </div>
              </div>
              {/* Add more usage of map if needed, kept simple */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}