// src/pages/Cart.jsx - Updated with safe price handling
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FaTrash, FaPlus, FaMinus, FaHeart, FaArrowLeft, FaShieldAlt, FaCreditCard, FaTruck, FaCheckCircle } from 'react-icons/fa';
import './Cart.css';

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
      <div className="empty-cart-container">
        {/* ... empty cart JSX ... */}
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>{t('shoppingCart')} ({getItemCount()} {getItemCount() === 1 ? t('item') : t('items')})</h1>
        <Link to="/products" className="continue-shopping">
          <FaArrowLeft /> {t('continueShopping')}
        </Link>
      </div>

      <div className="cart-layout">
        {/* Left Column - Cart Items */}
        <div className="cart-items-section">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => {
              // Safely parse item price
              const itemPrice = Number(item.price) || 0;
              const originalPrice = item.originalPrice ? Number(item.originalPrice) : null;
              const itemTotal = itemPrice * (item.quantity || 1);
              
              return (
                <div key={item.id} className="cart-item">
                  <div className="item-checkbox">
                    <input type="checkbox" defaultChecked />
                  </div>
                  
                  <div className="item-image">
                    <span className="item-icon">{item.icon || '🎮'}</span>
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-title">{item.name || 'Unnamed Item'}</h3>
                    <div className="item-platform">{item.platform || 'Digital'}</div>
                    <div className="item-seller">Sold by: DigitalStore</div>
                    
                    <div className="item-price-mobile">
                      <div className="current-price">{safeFormatPrice(itemPrice)}</div>
                      {originalPrice && originalPrice > itemPrice && (
                        <div className="original-price">
                          {safeFormatPrice(originalPrice)}
                        </div>
                      )}
                    </div>

                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="quantity-btn"
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{item.quantity || 1}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="quantity-btn"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleSaveForLater(item)}
                          className="save-later-btn"
                        >
                          <FaHeart /> {t('save')} for later
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="item-price-section">
                    <div className="price-desktop">
                      <div className="current-price">{safeFormatPrice(itemPrice)}</div>
                      {originalPrice && originalPrice > itemPrice && (
                        <div className="original-price">
                          {safeFormatPrice(originalPrice)}
                        </div>
                      )}
                      <div className="item-total">
                        Total: {safeFormatPrice(itemTotal)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clear Cart Button */}
          {cartItems.length > 0 && (
            <div className="cart-actions-bottom">
              <button onClick={clearCart} className="clear-cart-btn">
                <FaTrash /> Clear Cart
              </button>
            </div>
          )}

          {/* Saved for Later Section */}
          {savedForLater.length > 0 && (
            <div className="saved-for-later">
              <h3>Saved for Later ({savedForLater.length} items)</h3>
              <div className="saved-items">
                {savedForLater.map(item => {
                  const itemPrice = Number(item.price) || 0;
                  return (
                    <div key={item.id} className="saved-item">
                      <div className="saved-item-image">
                        <span className="item-icon">{item.icon || '🎮'}</span>
                      </div>
                      <div className="saved-item-details">
                        <h4>{item.name || 'Unnamed Item'}</h4>
                        <div className="saved-item-platform">{item.platform || 'Digital'}</div>
                        <div className="saved-item-price">{safeFormatPrice(itemPrice)}</div>
                      </div>
                      <div className="saved-item-actions">
                        <button 
                          onClick={() => handleMoveToCart(item)}
                          className="move-to-cart-btn"
                        >
                          Move to Cart
                        </button>
                        <button 
                          onClick={() => setSavedForLater(savedForLater.filter(i => i.id !== item.id))}
                          className="remove-saved-btn"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Price Details */}
        <div className="price-details-section">
          <div className="price-details-card">
            <h3>{t('priceDetails')}</h3>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>{t('total')} ({getItemCount()} {getItemCount() === 1 ? t('item') : t('items')})</span>
                <span>{safeFormatPrice(getCartTotal())}</span>
              </div>
              
              <div className="price-row">
                <span>{t('deliveryCharges')}</span>
                <span className={calculateDelivery() === 0 ? 'free' : ''}>
                  {calculateDelivery() === 0 ? t('free') : safeFormatPrice(calculateDelivery())}
                </span>
              </div>
              
              {appliedCoupon && (
                <div className="price-row discount-row">
                  <span>{t('discount')} ({appliedCoupon.discount}%)</span>
                  <span className="discount">-{safeFormatPrice(calculateDiscount())}</span>
                </div>
              )}

              <div className="price-row total-row">
                <span>{t('totalAmount')}</span>
                <span className="total-amount">{safeFormatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="savings-message">
              {calculateDiscount() > 0 && (
                <div className="saving">
                  You will save {safeFormatPrice(calculateDiscount())} on this order
                </div>
              )}
              {calculateDelivery() === 0 && getCartTotal() < 100 && (
                <div className="saving">
                  Add {safeFormatPrice(100 - getCartTotal())} more for FREE delivery
                </div>
              )}
            </div>

            {/* Coupon Section */}
            <div className="coupon-section">
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder={t('enterCouponCode')}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="apply-coupon-btn"
                >
                  {t('apply')}
                </button>
              </div>
              {appliedCoupon && (
                <div className="applied-coupon">
                  <span>{t('apply')}: {appliedCoupon.code}</span>
                  <button 
                    onClick={() => setAppliedCoupon(null)}
                    className="remove-coupon"
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="available-coupons">
                <p>{t('availableCoupons')}:</p>
                {coupons.map(coupon => (
                  <div key={coupon.code} className="coupon-tag">
                    <span className="coupon-code">{coupon.code}</span>
                    <span className="coupon-desc">{coupon.discount}% off on min. {safeFormatPrice(coupon.minOrder)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              className="checkout-btn"
              disabled={cartItems.length === 0}
            >
              <FaCreditCard /> {t('placeOrder')}
            </button>

            {/* Security Features */}
            <div className="security-features">
              <div className="security-item">
                <FaShieldAlt />
                <span>{t('safeSecurePayments')}</span>
              </div>
              <div className="security-item">
                <FaTruck />
                <span>{t('instantDigitalDelivery')}</span>
              </div>
              <div className="security-item">
                <FaCheckCircle />
                <span>{t('refundPolicy')}</span>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="recommended-products">
            <h3>Frequently Bought Together</h3>
            <div className="recommended-list">
              <div className="recommended-item">
                <span className="rec-icon">🎧</span>
                <div className="rec-details">
                  <span className="rec-name">Gaming Headset</span>
                  <span className="rec-price">+ $49.99</span>
                </div>
              </div>
              <div className="recommended-item">
                <span className="rec-icon">⌨️</span>
                <div className="rec-details">
                  <span className="rec-name">Mechanical Keyboard</span>
                  <span className="rec-price">+ $89.99</span>
                </div>
              </div>
              <div className="recommended-item">
                <span className="rec-icon">🖱️</span>
                <div className="rec-details">
                  <span className="rec-name">Gaming Mouse</span>
                  <span className="rec-price">+ $39.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}