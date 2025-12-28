// src/pages/Products.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { getBrands, getProductsByBrand } from "../lib/supabase";
import { FaShoppingCart, FaSearch, FaFilter, FaArrowLeft, FaStar, FaBolt } from "react-icons/fa";

export default function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, formatPrice } = useLanguage();
  const [selectedMainProduct, setSelectedMainProduct] = useState(null);
  const [sortBy, setSortBy] = useState("price-low");

  // State for data
  const [mainProducts, setMainProducts] = useState([]);
  const [subProducts, setSubProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Brands (Main Products) on mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch Sub-products when a brand is selected
  useEffect(() => {
    if (selectedMainProduct) {
      fetchSubProducts(selectedMainProduct.id);
    } else {
      setSubProducts([]);
    }
  }, [selectedMainProduct]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const brands = await getBrands();
      // Map DB fields to UI expected fields if necessary, or ensure UI uses DB fields
      // Database has: id, name, icon, description, color, platform, is_featured, product_count, popular_items, delivery_time
      setMainProducts(brands);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubProducts = async (brandId) => {
    try {
      setLoadingProducts(true);
      const products = await getProductsByBrand(brandId);
      // Database has: id, brand_id, name, description, price, original_price, discount_label, image_url, platform, stock, rating, is_popular
      // We need to map some fields to ensure compatibility if needed, or update UI to use DB fields directly.
      // UI expects: id, name, discountedPrice (db: price), originalPrice, discount (db: discount_label), icon, platform, delivery, rating, stock, popular

      const mappedProducts = products.map(p => ({
        ...p,
        discountedPrice: p.price, // DB uses decimal/number, UI helper formatPrice handles it
        originalPrice: p.original_price,
        discount: p.discount_label,
        // icon: inherited from selectedMainProduct usually, or p.image_url
        icon: selectedMainProduct.icon,
        delivery: p.delivery_time,
        popular: p.is_popular
      }));

      setSubProducts(mappedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const sortedSubProducts = [...subProducts].sort((a, b) => {
    const priceA = a.price; // DB value is number
    const priceB = b.price;

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
      price: product.price,
      originalPrice: product.original_price,
      quantity: 1
    });
    alert(`✅ ${product.name} ${t('addToCart')}!`);
  };

  const handleBuyNow = (product) => {
    const buyProduct = {
      ...product,
      price: product.price,
      originalPrice: product.original_price,
      quantity: 1
    };
    navigate('/checkout', { state: { buyNow: true, product: buyProduct } });
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, {
      state: { product: { ...product, price: product.price, originalPrice: product.original_price } }
    });
  };



  if (loading && !mainProducts.length) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchBrands} className="px-4 py-2 bg-accent text-primary rounded-lg font-bold">Retry</button>
        </div>
      </div>
    );
  }

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
                        {product.is_featured && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded uppercase border border-yellow-500/20">
                            Featured
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-mono">{product.product_count} Items</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-6 line-clamp-2">{product.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-xs text-gray-400">
                        <FaBolt className="mr-2 text-yellow-400" />
                        {product.delivery_time}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* popular_items is stored as text array/list string in DB, handled as array by Supabase if setup correctly, else need parsing */}
                        {Array.isArray(product.popular_items) && product.popular_items.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/5">{item}</span>
                        ))}
                        {Array.isArray(product.popular_items) && product.popular_items.length > 2 && <span className="text-xs text-gray-500 self-center">+{product.popular_items.length - 2} more</span>}
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
                { icon: "📦", label: t('totalProducts'), val: mainProducts.reduce((s, p) => s + (p.product_count || 0), 0) },
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

            {loadingProducts ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedSubProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-200 group cursor-pointer"
                    onClick={() => handleViewDetails(product)}
                  >
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
                        <span className="text-lg font-bold text-accent">{formatPrice(product.price)}</span>
                        <span className="text-sm text-gray-500 line-through">{formatPrice(product.original_price)}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors"
                        >
                          <FaShoppingCart className="mr-2" /> Add
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                          className="px-3 py-2 bg-accent hover:bg-accent-hover text-primary text-sm font-bold rounded-lg flex items-center justify-center transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loadingProducts && sortedSubProducts.length === 0 && (
              <div className="text-center py-20 bg-surface rounded-xl">
                <p className="text-gray-400">No products found for this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}