// src/pages/Products.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { FaShoppingCart, FaCreditCard, FaSearch, FaFilter, FaArrowLeft, FaStar, FaBolt, FaGamepad, FaMobileAlt, FaApple, FaGoogle, FaSpotify, FaTv, FaAmazon } from "react-icons/fa";

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
      popularItems: ["$5 Wallet", "$10 Wallet", "$20 Wallet", "$50 Wallet"],
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
      popularItems: ["$10 PSN Card", "$20 PSN Card", "$50 PSN Card"],
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
      popularItems: ["$15 iTunes", "$25 iTunes", "$50 iTunes"],
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

  const subProducts = selectedMainProduct ? generateSubProducts(selectedMainProduct.id) : [];

  const sortedSubProducts = [...subProducts].sort((a, b) => {
    const priceA = parseFloat(a.discountedPrice.replace('$', ''));
    const priceB = parseFloat(b.discountedPrice.replace('$', ''));

    switch (sortBy) {
      case "price-low": return priceA - priceB;
      case "price-high": return priceB - priceA;
      case "rating": return parseFloat(b.rating) - parseFloat(a.rating);
      case "popular": return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      default: return 0;
    }
  });

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      price: parseFloat(product.discountedPrice.replace('$', '')),
      originalPrice: parseFloat(product.originalPrice.replace('$', '')),
      quantity: 1
    });
    alert(`✅ ${product.name} ${t('addToCart')}!`);
  };

  const handleBuyNow = (product) => {
    const buyProduct = {
      ...product,
      price: parseFloat(product.discountedPrice.replace('$', '')),
      originalPrice: parseFloat(product.originalPrice.replace('$', '')),
      quantity: 1
    };
    navigate('/checkout', { state: { buyNow: true, product: buyProduct } });
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, {
      state: { product: { ...product, price: parseFloat(product.discountedPrice.replace('$', '')), originalPrice: parseFloat(product.originalPrice.replace('$', '')) } }
    });
  };

  return (
    <div className="min-h-screen bg-primary pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">{t('instantDigitalGamingCodes')}</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">{t('getInstantAccess')}</p>
      </div>

      <div className="max-w-7xl mx-auto">
        {!selectedMainProduct ? (
          /* CATEGORIES VIEW */
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainProducts.map(product => (
                <div
                  key={product.id}
                  className="group relative bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-accent hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedMainProduct(product)}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-9xl font-bold">{product.icon}</span>
                  </div>

                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl shadow-lg" style={{ backgroundColor: product.color }}>
                        {product.icon}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {product.featured && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded uppercase border border-yellow-500/20">
                            Featured
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-mono">{product.productCount} Items</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-6 line-clamp-2">{product.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-xs text-gray-400">
                        <FaBolt className="mr-2 text-yellow-400" />
                        {product.deliveryTime}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.popularItems.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/5">{item}</span>
                        ))}
                        {product.popularItems.length > 2 && <span className="text-xs text-gray-500 self-center">+{product.popularItems.length - 2} more</span>}
                      </div>
                    </div>

                    <button className="w-full py-3 bg-white/5 hover:bg-accent hover:text-primary rounded-xl font-bold transition-colors flex items-center justify-center group-hover:shadow-lg">
                      {t('viewAll')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-surface p-6 rounded-2xl border border-white/5">
              {[
                { icon: "📦", label: t('totalProducts'), val: mainProducts.reduce((s, p) => s + p.productCount, 0) },
                { icon: "⚡", label: t('fastestDelivery'), val: "Instant" },
                { icon: "⭐", label: t('customerRating'), val: "4.9/5" },
                { icon: "🎯", label: t('categories'), val: mainProducts.length }
              ].map((stat, i) => (
                <div key={i} className="text-center p-4">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.val}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* SINGLE CATEGORY PRODUCTS VIEW */
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-surface p-4 rounded-xl border border-white/5">
              <button
                onClick={() => setSelectedMainProduct(null)}
                className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 md:mb-0"
              >
                <FaArrowLeft className="mr-2" /> {t('backToCategories')}
              </button>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <span>{selectedMainProduct.icon}</span> {selectedMainProduct.name}
                </h2>
                <p className="text-sm text-gray-400 mt-1">{t('showingProducts', { count: sortedSubProducts.length, name: selectedMainProduct.name })}</p>
              </div>

              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-primary border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                >
                  <option value="popular">{t('mostPopular')}</option>
                  <option value="price-low">{t('priceLowToHigh')}</option>
                  <option value="price-high">{t('priceHighToLow')}</option>
                  <option value="rating">{t('highestRated')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedSubProducts.map(product => (
                <div key={product.id} className="bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-200 group">
                  <div className="relative p-6 flex justify-center bg-gradient-to-b from-white/5 to-transparent">
                    {product.popular && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded shadow-lg">
                        Hot
                      </div>
                    )}
                    <span className="text-6xl drop-shadow-2xl filter transform group-hover:scale-110 transition-transform duration-300">{product.icon}</span>
                    <div className="absolute bottom-2 left-0 w-full text-center">
                      <span className="px-2 py-1 bg-accent/90 text-primary text-xs font-bold rounded-full">{product.discount}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">{product.platform}</span>
                      <div className="flex items-center text-yellow-400 text-xs gap-1">
                        <FaStar /> {product.rating}
                      </div>
                    </div>

                    <h3 className="font-bold text-white mb-4 line-clamp-1">{product.name}</h3>

                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-lg font-bold text-accent">{formatPrice(parseFloat(product.discountedPrice.replace('$', '')))}</span>
                      <span className="text-sm text-gray-500 line-through">{formatPrice(parseFloat(product.originalPrice.replace('$', '')))}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleAddToCart(product)} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors">
                        <FaShoppingCart className="mr-2" /> Add
                      </button>
                      <button onClick={() => handleBuyNow(product)} className="px-3 py-2 bg-accent hover:bg-accent-hover text-primary text-sm font-bold rounded-lg flex items-center justify-center transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}