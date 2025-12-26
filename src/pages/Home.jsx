// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { FaGamepad, FaPlaystation, FaXbox, FaSpotify, FaSteam, FaGift, FaArrowRight, FaShieldAlt, FaBolt, FaHeadset } from "react-icons/fa";

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: "Steam Wallet",
      price: "$50",
      discount: "10% OFF",
      icon: FaSteam,
      color: "text-blue-400",
      category: "Gaming"
    },
    {
      id: 2,
      name: "PlayStation Plus",
      price: "$25",
      discount: "5% OFF",
      icon: FaPlaystation,
      color: "text-blue-600",
      category: "Gaming"
    },
    {
      id: 3,
      name: "Xbox Game Pass",
      price: "$30",
      discount: "15% OFF",
      icon: FaXbox,
      color: "text-green-500",
      category: "Gaming"
    },
    {
      id: 4,
      name: "Spotify Premium",
      price: "$12",
      discount: "20% OFF",
      icon: FaSpotify,
      color: "text-green-400",
      category: "Entertainment"
    }
  ];

  const stats = [
    { number: "50K+", label: t("happyCustomers") },
    { number: "100K+", label: t("codesDelivered") },
    { number: "99.9%", label: t("successRate") },
    { number: "24/7", label: t("customerSupport") }
  ];

  return (
    <div className="min-h-screen bg-primary text-text">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary/50 opacity-90 z-0"></div>
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-text">
              {t("instantDigitalGamingCodes")}
            </h1>
            <p className="text-xl text-text-muted mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t("getInstantAccess") || "Level up your gaming experience with instant delivery on top-ups, gift cards, and subscriptions."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate("/products")}
                className="px-8 py-4 bg-accent text-primary font-bold rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-hover transform hover:-translate-y-1 transition-all duration-200 flex items-center"
              >
                {t("shopNow")} <FaArrowRight className="ml-2" />
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                {t("howItWorks")}
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 relative lg:pl-12">
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="space-y-6 mt-12">
                <div className="p-6 bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <FaSteam className="text-5xl text-blue-400 mb-4" />
                  <h3 className="text-lg font-bold">Steam Wallet</h3>
                  <p className="text-sm text-gray-400">Global Region</p>
                </div>
                <div className="p-6 bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <FaPlaystation className="text-5xl text-blue-600 mb-4" />
                  <h3 className="text-lg font-bold">PSN Cards</h3>
                  <p className="text-sm text-gray-400">US - UK - EU</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <FaXbox className="text-5xl text-green-500 mb-4" />
                  <h3 className="text-lg font-bold">Xbox Live</h3>
                  <p className="text-sm text-gray-400">Gold & PC Pass</p>
                </div>
                <div className="p-6 bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <FaGift className="text-5xl text-accent mb-4" />
                  <h3 className="text-lg font-bold">Gift Cards</h3>
                  <p className="text-sm text-gray-400">Amazon & More</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-primary-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <h3 className="text-4xl font-black text-accent mb-2">{stat.number}</h3>
                <p className="text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">{t("mostPopularProducts")}</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-400">{t("mostPopularGamingCodes")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-accent/90 text-primary text-xs font-bold rounded-full backdrop-blur-sm shadow-lg">
                    {product.discount}
                  </span>
                </div>

                <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-white/5 to-transparent h-48 group-hover:scale-105 transition-transform duration-500">
                  <product.icon className={`text-6xl ${product.color} drop-shadow-2xl`} />
                </div>

                <div className="p-6">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">{product.category}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-accent">{product.price}</span>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="p-3 bg-white/5 rounded-xl text-gray-300 hover:bg-accent hover:text-primary transition-colors"
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => navigate("/products")} className="px-8 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors font-medium">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-primary-dark relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("howItWorks")}</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-400">{t("getCodesInSteps")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: FaMousePointer, title: t("chooseYourCode") || "Select Product", desc: t("selectFromVarious") || "Choose from our wide range of games and gift cards." },
              { icon: FaCreditCard, title: t("completePayment") || "Make Payment", desc: t("securePaymentOptions") || "Pay securely using your preferred payment method." },
              { icon: FaCheckCircle, title: t("instantDelivery") || "Receive Code", desc: t("receiveCodeInstantly") || "Get your digital code instantly via email." }
            ].map((step, idx) => ( // Use simplified mock icons for map simplicity in this view block, actual icons imported below
              <div key={idx} className="relative p-8 rounded-3xl bg-surface/50 border border-white/5 backdrop-blur-sm text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center text-primary text-2xl font-bold shadow-lg shadow-accent/20">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper components for icons to restart mapping issue
function FaMousePointer(props) { return <FaGamepad {...props} />; } // Placeholder mapping
import { FaCreditCard, FaCheckCircle, FaMousePointer as FaMouseSelect } from "react-icons/fa"; // Re-import correct ones