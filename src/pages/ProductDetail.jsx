// src/pages/ProductDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FaArrowLeft, FaShoppingCart, FaCreditCard, FaCheckCircle, FaStar, FaTruck, FaShieldAlt } from 'react-icons/fa';
import './ProductDetail.css';

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

  // Get product from location state or reconstruct from id
  let product = location.state?.product;

  // If no product in state, reconstruct from id (for direct navigation)
  if (!product && id) {
    const [mainId, subId] = id.split('-');
    const mainProducts = [
      { id: 1, name: "Steam Wallet", icon: "🎮", color: "#1b2838", platform: "Steam" },
      { id: 2, name: "PlayStation Network", icon: "🎯", color: "#003087", platform: "PlayStation" },
      { id: 3, name: "Xbox Live", icon: "⚡", color: "#107c10", platform: "Xbox" },
      { id: 4, name: "Nintendo eShop", icon: "🎲", color: "#e60012", platform: "Nintendo" },
      { id: 5, name: "Apple Gift Cards", icon: "🍎", color: "#a2aaad", platform: "Apple" },
      { id: 6, name: "Google Play", icon: "📱", color: "#4285f4", platform: "Google" },
      { id: 7, name: "Spotify Premium", icon: "🎵", color: "#1db954", platform: "Spotify" },
      { id: 8, name: "Netflix Gift Cards", icon: "📺", color: "#e50914", platform: "Netflix" },
      { id: 9, name: "Amazon Gift Cards", icon: "📦", color: "#ff9900", platform: "Amazon" },
      { id: 10, name: "Razer Gold", icon: "🐍", color: "#44d62c", platform: "Razer" },
      { id: 11, name: "Free Fire", icon: "🔥", color: "#FF5500", platform: "Free Fire", category: "Game Top-up" }
    ];
    const mainProduct = mainProducts.find(p => p.id === parseInt(mainId));
    if (mainProduct) {
      const denominations = [5, 10, 20, 25, 30, 50, 75, 100, 150, 200];
      const discounts = ["5% OFF", "10% OFF", "15% OFF", "20% OFF", "25% OFF"];
      const deliveryTimes = ["Instant", "5 mins", "10 mins", "15 mins"];
      const index = parseInt(subId) - 1;
      const amount = denominations[index] || 10;
      const discountPercentage = parseInt(discounts[index % discounts.length]);
      const discountedPrice = amount * (1 - discountPercentage / 100);

      product = {
        id: id,
        mainId: parseInt(mainId),
        name: `${mainProduct.name} $${amount}`,
        originalPrice: amount,
        discountedPrice: discountedPrice,
        discount: discounts[index % discounts.length],
        icon: mainProduct.icon,
        platform: mainProduct.platform,
        delivery: deliveryTimes[index % deliveryTimes.length],
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        stock: Math.floor(Math.random() * 100) + 20,
        popular: index < 3,
        category: mainProduct.name,
        color: mainProduct.color,
        description: `Get ${amount} worth of ${mainProduct.name} credit. Perfect for purchasing games, DLCs, subscriptions, and in-game content. Instant delivery guaranteed.`
      };
    }
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          {t('backToCategories')}
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Validate inputs for Game Top-ups
    if (product.category === 'Game Top-up' || product.category === 'Free Fire' || product.category === 'PUBG Mobile') {
      const newErrors = {};
      if (!playerId) newErrors.playerId = t('playerIdRequired') || 'Player ID is required';
      // Server ID might be optional depending on game, but let's assume required for some
      if (product.platform === 'Free Fire' && !playerId) newErrors.playerId = 'Player ID is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    const cartProduct = {
      ...product,
      quantity: quantity,
      price: product.discountedPrice,
      playerId,
      serverId
    };
    addToCart(cartProduct);
    alert(`✅ ${product.name} ${t('addToCart')}!`);
    setErrors({});
  };

  const handleBuyNow = () => {
    const buyProduct = {
      ...product,
      quantity: quantity,
      price: product.discountedPrice
    };
    navigate('/checkout', { state: { buyNow: true, product: buyProduct } });
  };

  const savings = product.originalPrice - product.discountedPrice;

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> {t('backToCategories')}
      </button>

      <div className="product-detail-content">
        <div className="product-detail-left">
          <div className="product-image-large" style={{ background: product.color || '#4e73df' }}>
            <span className="product-icon-large">{product.icon}</span>
          </div>

          <div className="product-badges">
            {product.popular && (
              <span className="badge popular-badge">🔥 {t('mostPopular')}</span>
            )}
            <span className="badge discount-badge">{product.discount}</span>
            <span className="badge delivery-badge">🚀 {product.delivery} {t('delivery')}</span>
          </div>
        </div>

        <div className="product-detail-right">
          <div className="product-header">
            <span className="product-category">{product.category || product.platform}</span>
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              {Array.from({ length: Math.floor(parseFloat(product.rating)) }).map((_, i) => (
                <FaStar key={i} className="star-icon" />
              ))}
              <span className="rating-text">({product.rating})</span>
            </div>
          </div>

          <div className="product-pricing-section">
            <div className="price-row">
              <span className="current-price-large">{formatPrice(product.discountedPrice)}</span>
              <span className="original-price-large">{formatPrice(product.originalPrice)}</span>
            </div>
            <div className="savings-info">
              {t('save')} {formatPrice(savings)} ({product.discount})
            </div>
          </div>

          <div className="product-info-grid">
            <div className="info-item">
              <FaTruck className="info-icon" />
              <div>
                <span className="info-label">{t('delivery')}</span>
                <span className="info-value">{product.delivery}</span>
              </div>
            </div>
            <div className="info-item">
              <FaCheckCircle className="info-icon" />
              <div>
                <span className="info-label">{t('platform')}</span>
                <span className="info-value">{product.platform}</span>
              </div>
            </div>
            <div className="info-item">
              <FaShieldAlt className="info-icon" />
              <div>
                <span className="info-label">{t('inStock')}</span>
                <span className="info-value">{product.stock} {t('items')}</span>
              </div>
            </div>
          </div>

          <div className="product-description">
            <h3>{t('description')}</h3>
            <p>{product.description || `Get instant access to ${product.name}. This digital code can be redeemed immediately and used to purchase games, DLCs, subscriptions, and more.`}</p>
          </div>

          {/* Player ID Inputs for Game Top-ups */}
          {(product.category === 'Game Top-up' || product.platform === 'Free Fire' || product.platform === 'PUBG Mobile') && (
            <div className="player-id-section" style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3>{t('accountDetails') || 'Account Details'}</h3>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Player ID <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder="Enter Player ID"
                  className={errors.playerId ? 'error-input' : ''}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: errors.playerId ? '1px solid red' : '1px solid #ddd' }}
                />
                {errors.playerId && <span style={{ color: 'red', fontSize: '12px' }}>{errors.playerId}</span>}
              </div>

              {/* Optional Server ID field */}
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Server/Zone ID (Optional)</label>
                <input
                  type="text"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder="Enter Server ID"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
          )}

          <div className="product-quantity">
            <label>{t('quantity')}:</label>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="quantity-input"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions-large">
            <button className="btn btn-primary btn-large" onClick={handleAddToCart}>
              <FaShoppingCart /> {t('addToCart')}
            </button>
            <button className="btn btn-secondary btn-large" onClick={handleBuyNow}>
              <FaCreditCard /> {t('buyNow')}
            </button>
          </div>

          <div className="product-features">
            <div className="feature-item">
              <FaShieldAlt />
              <span>{t('safeSecurePayments')}</span>
            </div>
            <div className="feature-item">
              <FaTruck />
              <span>{t('instantDigitalDelivery')}</span>
            </div>
            <div className="feature-item">
              <FaCheckCircle />
              <span>{t('refundPolicy')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

