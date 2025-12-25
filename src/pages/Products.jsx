// src/components/Products.jsx
// frontend/src/pages/Products.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";
import "./Products.css";

export default function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, formatPrice } = useLanguage();
  const [selectedMainProduct, setSelectedMainProduct] = useState(null);
  const [sortBy, setSortBy] = useState("price-low");

  // 10 Main Products (Categories)
  const mainProducts = [
    {
      id: 1,
      name: "Steam Wallet",
      icon: "🎮",
      description: "Digital currency for Steam platform. Buy games, DLCs, and in-game items.",
      color: "#1b2838",
      platform: "Steam",
      productCount: 15,
      featured: true,
      popularItems: ["$5 Wallet", "$10 Wallet", "$20 Wallet", "$50 Wallet", "$100 Wallet"],
      deliveryTime: "Instant Delivery"
    },
    {
      id: 2,
      name: "PlayStation Network",
      icon: "🎯",
      description: "PSN gift cards and codes for PS4/PS5 games, subscriptions, and content.",
      color: "#003087",
      platform: "PlayStation",
      productCount: 12,
      featured: true,
      popularItems: ["$10 PSN Card", "$20 PSN Card", "$50 PSN Card", "PS Plus 1 Month"],
      deliveryTime: "1-5 Minutes"
    },
    {
      id: 3,
      name: "Xbox Live",
      icon: "⚡",
      description: "Microsoft Xbox gift cards and Game Pass subscriptions.",
      color: "#107c10",
      platform: "Xbox",
      productCount: 10,
      featured: true,
      popularItems: ["Xbox $10 Gift", "Xbox $25 Gift", "Game Pass Ultimate"],
      deliveryTime: "Instant Delivery"
    },
    {
      id: 4,
      name: "Nintendo eShop",
      icon: "🎲",
      description: "Nintendo digital codes for Switch games and eShop credit.",
      color: "#e60012",
      platform: "Nintendo",
      productCount: 8,
      featured: false,
      popularItems: ["$10 eShop", "$20 eShop", "$35 eShop"],
      deliveryTime: "2-10 Minutes"
    },
    {
      id: 5,
      name: "Apple Gift Cards",
      icon: "🍎",
      description: "App Store & iTunes cards for apps, music, movies, and subscriptions.",
      color: "#a2aaad",
      platform: "Apple",
      productCount: 20,
      featured: true,
      popularItems: ["$15 iTunes", "$25 iTunes", "$50 iTunes", "$100 iTunes"],
      deliveryTime: "Instant"
    },
    {
      id: 6,
      name: "Google Play",
      icon: "📱",
      description: "Android app store credit for apps, games, movies, and books.",
      color: "#4285f4",
      platform: "Google",
      productCount: 18,
      featured: false,
      popularItems: ["$10 Google Play", "$25 Google Play", "$50 Google Play"],
      deliveryTime: "Instant"
    },
    {
      id: 7,
      name: "Spotify Premium",
      icon: "🎵",
      description: "Music streaming subscription with ad-free listening.",
      color: "#1db954",
      platform: "Spotify",
      productCount: 6,
      featured: true,
      popularItems: ["1 Month Premium", "3 Months Premium", "1 Year Premium"],
      deliveryTime: "5-15 Minutes"
    },
    {
      id: 8,
      name: "Netflix Gift Cards",
      icon: "📺",
      description: "Video streaming subscription cards for movies and TV shows.",
      color: "#e50914",
      platform: "Netflix",
      productCount: 7,
      featured: false,
      popularItems: ["$30 Netflix", "$60 Netflix"],
      deliveryTime: "Instant"
    },
    {
      id: 9,
      name: "Amazon Gift Cards",
      icon: "📦",
      description: "Amazon shopping balance for millions of products.",
      color: "#ff9900",
      platform: "Amazon",
      productCount: 25,
      featured: true,
      popularItems: ["$25 Amazon", "$50 Amazon", "$100 Amazon"],
      deliveryTime: "1-3 Minutes"
    },
    {
      id: 10,
      name: "Razer Gold",
      icon: "🐍",
      description: "Gaming credits and pins for top games and esports titles.",
      color: "#44d62c",
      platform: "Razer",
      productCount: 5,
      featured: false,
      popularItems: ["$10 Razer Gold", "$25 Razer Gold"],
      deliveryTime: "Instant"
    }
  ];

  // Generate 10 sub-products for each main product
  const generateSubProducts = (mainProductId) => {
    const mainProduct = mainProducts.find(p => p.id === mainProductId);
    const denominations = [5, 10, 20, 25, 30, 50, 75, 100, 150, 200];
    const discounts = ["5% OFF", "10% OFF", "15% OFF", "20% OFF", "25% OFF"];
    const deliveryTimes = ["Instant", "5 mins", "10 mins", "15 mins"];
    
    return denominations.map((amount, index) => {
      const originalPrice = amount;
      const discountPercentage = parseInt(discounts[index % discounts.length]);
      const discountedPrice = originalPrice * (1 - discountPercentage / 100);
      
      return {
        id: `${mainProductId}-${index + 1}`,
        mainId: mainProductId,
        name: `${mainProduct.name} $${amount}`,
        originalPrice: `$${originalPrice}.00`,
        discountedPrice: `$${discountedPrice.toFixed(2)}`,
        discount: discounts[index % discounts.length],
        icon: mainProduct.icon,
        platform: mainProduct.platform,
        delivery: deliveryTimes[index % deliveryTimes.length],
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        stock: Math.floor(Math.random() * 100) + 20,
        popular: index < 3,
        category: mainProduct.name
      };
    });
  };

  // Get all sub-products for the selected main product
  const subProducts = selectedMainProduct ? generateSubProducts(selectedMainProduct.id) : [];

  // Sort sub-products
  const sortedSubProducts = [...subProducts].sort((a, b) => {
    const priceA = parseFloat(a.discountedPrice.replace('$', ''));
    const priceB = parseFloat(b.discountedPrice.replace('$', ''));
    
    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "popular":
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      default:
        return 0;
    }
  });

  const handleMainProductClick = (product) => {
    setSelectedMainProduct(product);
  };

  const handleBackToCategories = () => {
    setSelectedMainProduct(null);
  };

  const handleAddToCart = (product) => {
    const price = parseFloat(product.discountedPrice.replace('$', ''));
    const originalPrice = parseFloat(product.originalPrice.replace('$', ''));
    
    const cartProduct = {
      ...product,
      price: price,
      originalPrice: originalPrice,
      quantity: 1
    };
    
    addToCart(cartProduct);
    alert(`✅ ${product.name} ${t('addToCart')}!`);
  };

  const handleBuyNow = (product) => {
    const price = parseFloat(product.discountedPrice.replace('$', ''));
    const originalPrice = parseFloat(product.originalPrice.replace('$', ''));
    
    const buyProduct = {
      ...product,
      price: price,
      originalPrice: originalPrice,
      quantity: 1
    };
    
    navigate('/checkout', { state: { buyNow: true, product: buyProduct } });
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { 
      state: { 
        product: {
          ...product,
          price: parseFloat(product.discountedPrice.replace('$', '')),
          originalPrice: parseFloat(product.originalPrice.replace('$', ''))
        }
      } 
    });
  };

  return (
    <div className="products-container">
      {/* Header */}
      <div className="products-header">
        <h1>{t('instantDigitalGamingCodes')}</h1>
        <p>{t('getInstantAccess')}</p>
      </div>

      <div className="products-content">
        {/* Main Content Area */}
        <div className="products-main">
          {!selectedMainProduct ? (
            /* CATEGORIES VIEW - BIG CARDS */
            <>
              <div className="categories-header">
                <h2>🎮 {t('featuredCategories')}</h2>
                <p>{t('chooseFromCategories')}</p>
              </div>
              
              <div className="main-categories-grid">
                {mainProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="main-category-card"
                    onClick={() => handleMainProductClick(product)}
                    style={{
                      background: `linear-gradient(135deg, ${product.color}15, white)`,
                      border: `2px solid ${product.color}30`,
                      borderLeft: `6px solid ${product.color}`
                    }}
                  >
                    <div className="category-card-header">
                      <div 
                        className="category-card-icon"
                        style={{ 
                          background: product.color,
                          color: "white"
                        }}
                      >
                        {product.icon}
                      </div>
                      
                      <div className="category-card-badges">
                        {product.featured && (
                          <span className="featured-badge">🔥 Featured</span>
                        )}
                        <span className="product-count-badge">
                          {product.productCount} Products
                        </span>
                      </div>
                    </div>
                    
                    <div className="category-card-body">
                      <h3 className="category-name">{product.name}</h3>
                      <p className="category-description">{product.description}</p>
                      
                      <div className="category-platform">
                        <span className="platform-tag">{t('platform')}: {product.platform}</span>
                        <span className="delivery-tag">🚀 {product.deliveryTime}</span>
                      </div>
                      
                      <div className="popular-items">
                        <span className="popular-label">{t('popularItems')}:</span>
                        <div className="popular-tags">
                          {product.popularItems.map((item, index) => (
                            <span key={index} className="popular-item-tag">{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="category-card-footer">
                      <button 
                        className="view-products-btn"
                        style={{ background: product.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMainProductClick(product);
                        }}
                      >
                        {t('viewAll')} ({product.productCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="categories-stats">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <div className="stat-number">
                      {mainProducts.reduce((sum, p) => sum + p.productCount, 0)}
                    </div>
                    <div className="stat-label">{t('totalProducts')}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <div className="stat-number">Instant</div>
                    <div className="stat-label">{t('fastestDelivery')}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <div className="stat-number">4.8/5</div>
                    <div className="stat-label">{t('customerRating')}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-number">{mainProducts.length}</div>
                    <div className="stat-label">{t('categories')}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* PRODUCTS VIEW */
            <>
              <div className="products-toolbar">
                <div className="results-section">
                  <button 
                    className="back-to-categories-btn"
                    onClick={handleBackToCategories}
                  >
                    ← {t('backToCategories')}
                  </button>
                  <h2>{selectedMainProduct.name} - {t('allProducts')}</h2>
                  <p>{t('showingProducts', { count: sortedSubProducts.length, name: selectedMainProduct.name })}</p>
                </div>
                
                <div className="sort-options">
                  <label>{t('sortBy')}:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="popular">{t('mostPopular')}</option>
                    <option value="price-low">{t('priceLowToHigh')}</option>
                    <option value="price-high">{t('priceHighToLow')}</option>
                    <option value="rating">{t('highestRated')}</option>
                  </select>
                </div>
              </div>

              <div className="products-grid">
                {sortedSubProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-badge">{product.discount}</div>
                    <div className="product-image">{product.icon}</div>
                    
                    <div className="product-platform">
                      <span className="platform-tag">{product.platform}</span>
                      {product.popular && (
                        <span className="popular-tag">🔥 Popular</span>
                      )}
                    </div>
                    
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="product-rating">
                      {"⭐".repeat(Math.floor(parseFloat(product.rating)))}
                      <span className="rating-number">({product.rating})</span>
                    </div>

                    <div className="product-pricing">
                      <span className="current-price">{formatPrice(parseFloat(product.discountedPrice.replace('$', '')))}</span>
                      <span className="original-price">{formatPrice(parseFloat(product.originalPrice.replace('$', '')))}</span>
                      <span className="savings">
                        {t('save')} {formatPrice(parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.discountedPrice.replace('$', '')))}
                      </span>
                    </div>

                    <div className="product-delivery">
                      <span className="delivery-badge">
                        🚀 {product.delivery} {t('delivery')}
                      </span>
                      <span className="stock-info">
                        {product.stock > 10 ? (
                          <span className="in-stock">✓ {t('inStock')} ({product.stock})</span>
                        ) : (
                          <span className="low-stock">⚠ {t('lowStock')} ({product.stock})</span>
                        )}
                      </span>
                    </div>

                    <div className="product-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaShoppingCart /> {t('addToCart')}
                      </button>
                      <button 
                        className="btn btn-buy"
                        onClick={() => handleBuyNow(product)}
                      >
                        <FaCreditCard /> {t('buyNow')}
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleViewDetails(product)}
                      >
                        {t('viewDetails')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}