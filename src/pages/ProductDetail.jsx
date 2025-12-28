// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getProductById } from '../lib/supabase';
import { FaArrowLeft, FaShoppingCart, FaCreditCard, FaCheckCircle, FaStar, FaTruck, FaShieldAlt, FaMinus, FaPlus } from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { t, formatPrice } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [errors, setErrors] = useState({});

  // State for fetched product if not passed via state
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);

  // Get product from location state or fetched state
  let product = location.state?.product || fetchedProduct;

  useEffect(() => {
    if (!product && id) {
      fetchProduct(id);
    } else {
      setLoading(false);
    }
  }, [id, product]);

  const fetchProduct = async (productId) => {
    try {
      setLoading(true);
      const data = await getProductById(productId);

      // Map DB fields to UI expected fields
      const mappedProduct = {
        ...data,
        discountedPrice: data.price,
        originalPrice: data.original_price,
        discount: data.discount_label || data.discount,
        icon: data.image_url || data.brands?.icon || '📦', // Fallback icon
        color: data.brands?.color,
        delivery: data.delivery_time,
        popular: data.is_popular
      };

      setFetchedProduct(mappedProduct);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white">
        <h2 className="text-2xl font-bold mb-4">{error || "Product not found"}</h2>
        <button onClick={() => navigate('/products')} className="px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-colors">
          {t('backToCategories')}
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.category === 'Game Top-up' || product.platform === 'Free Fire' || product.platform === 'PUBG Mobile') {
      // ... (existing validation logic)
      const newErrors = {};
      if (!playerId) newErrors.playerId = t('playerIdRequired') || 'Player ID is required';
      if (product.platform === 'Free Fire' && !playerId) newErrors.playerId = 'Player ID is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    // Parse prices handling string format (if coming from legacy state) or number (from DB)
    const priceVal = typeof product.discountedPrice === 'string'
      ? parseFloat(product.discountedPrice.replace('$', ''))
      : product.discountedPrice;

    const originalVal = typeof product.originalPrice === 'string'
      ? parseFloat(product.originalPrice.replace('$', ''))
      : product.originalPrice;

    const cartProduct = {
      ...product,
      quantity: quantity,
      price: priceVal,
      originalPrice: originalVal,
      playerId,
      serverId
    };
    addToCart(cartProduct);
    alert(`✅ ${product.name} ${t('addToCart')}!`);
    setErrors({});
  };

  const handleBuyNow = () => {
    const priceVal = typeof product.discountedPrice === 'string'
      ? parseFloat(product.discountedPrice.replace('$', ''))
      : product.discountedPrice;

    const originalVal = typeof product.originalPrice === 'string'
      ? parseFloat(product.originalPrice.replace('$', ''))
      : product.originalPrice;

    const buyProduct = {
      ...product,
      quantity: quantity,
      price: priceVal,
      originalPrice: originalVal
    };
    navigate('/checkout', { state: { buyNow: true, product: buyProduct } });
  };

  const priceVal = typeof product.discountedPrice === 'string' ? parseFloat(product.discountedPrice.replace('$', '')) : product.discountedPrice;
  const originalPriceVal = typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice.replace('$', '')) : product.originalPrice;
  const savings = originalPriceVal - priceVal;

  return (
    <div className="min-h-screen bg-primary text-white pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> {t('backToCategories')}
        </button>

        <div className="bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left Column: Image/Icon */}
            <div className="p-12 flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="text-9xl font-bold">{product.icon}</span>
              </div>

              <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center text-8xl sm:text-9xl shadow-2xl animate-float" style={{ backgroundColor: product.color || '#3B82F6', color: 'white' }}>
                {product.icon}
              </div>

              <div className="flex gap-4 mt-8 relative z-10">
                {product.popular && (
                  <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full shadow-lg flex items-center">
                    🔥 {t('mostPopular')}
                  </span>
                )}
                <span className="px-4 py-2 bg-accent text-primary font-bold rounded-full shadow-lg">
                  {product.discount || 'Special Offer'}
                </span>
                <span className="px-4 py-2 bg-blue-600 text-white font-bold rounded-full shadow-lg flex items-center">
                  🚀 {product.delivery || 'Instant'}
                </span>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="p-8 lg:p-12 bg-surface">
              <div className="mb-6">
                <span className="text-sm font-mono text-accent uppercase tracking-wider">{product.category || product.platform}</span>
                <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-4 leading-tight">{product.name}</h1>
                <div className="flex items-center space-x-2 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(parseFloat(product.rating)) ? 'text-yellow-400' : 'text-gray-600'} />
                  ))}
                  <span className="text-gray-400 ml-2">({product.rating || '5.0'})</span>
                </div>
              </div>

              <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
                <span className="text-4xl sm:text-5xl font-bold text-white">{formatPrice(priceVal)}</span>
                <div className="flex flex-col mb-2">
                  <span className="text-xl text-gray-500 line-through">{formatPrice(originalPriceVal)}</span>
                  <span className="text-sm text-green-400">{t('save')} {formatPrice(savings)}</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: FaTruck, label: t('delivery'), val: product.delivery },
                  { icon: FaCheckCircle, label: t('platform'), val: product.platform },
                  { icon: FaShieldAlt, label: t('inStock'), val: `${product.stock || 99} ${t('items')}` }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <item.icon className="text-accent mb-2 text-xl" />
                    <div className="text-xs text-gray-400 uppercase">{item.label}</div>
                    <div className="font-bold text-sm">{item.val}</div>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-lg mb-2 text-white">{t('description')}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {product.description || `Get instant access to ${product.name}. This digital code can be redeemed immediately and used to purchase games, DLCs, subscriptions, and more. 100% official and secure.`}
                </p>
              </div>

              {/* Player ID Inputs */}
              {(product.category === 'Game Top-up' || product.platform === 'Free Fire' || product.platform === 'PUBG Mobile') && (
                <div className="bg-primary/50 border border-accent/20 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-white mb-4 flex items-center">
                    <FaCheckCircle className="text-accent mr-2" />
                    {t('accountDetails') || 'Account Details'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        placeholder="Enter Player ID"
                        className={`w-full bg-surface border ${errors.playerId ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors`}
                      />
                      {errors.playerId && <p className="text-red-500 text-xs mt-1">{errors.playerId}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Server/Zone ID <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={serverId}
                        onChange={(e) => setServerId(e.target.value)}
                        placeholder="Enter Server ID"
                        className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-12 text-center bg-transparent text-white font-bold focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="flex flex-1 w-full gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <FaShoppingCart /> {t('addToCart')}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-4 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/25"
                  >
                    <FaCreditCard /> {t('buyNow')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
