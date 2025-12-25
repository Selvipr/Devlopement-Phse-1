import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./Home.css";

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const featuredProducts = [
    {
      id: 1,
      name: "Steam Wallet Code",
      price: "$50",
      discount: "10% OFF",
      image: "🎮",
      category: "Gaming"
    },
    {
      id: 2,
      name: "PlayStation Network",
      price: "$25",
      discount: "5% OFF",
      image: "🎯",
      category: "Gaming"
    },
    {
      id: 3,
      name: "Xbox Live Gold",
      price: "$30",
      discount: "15% OFF",
      image: "⚡",
      category: "Gaming"
    },
    {
      id: 4,
      name: "Spotify Premium",
      price: "$12",
      discount: "20% OFF",
      image: "🎵",
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
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {t("instantDigitalGamingCodes")}
          </h1>
          <p className="hero-subtitle">
            {t("getInstantAccess")}
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/products")}>{t("shopNow")}</button>
            <button className="btn btn-outline" onClick={() => {
              const element = document.querySelector('.how-it-works');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}>{t("howItWorks")}</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <div className="card-icon">🎮</div>
            <h4>Steam Wallet</h4>
            <p>Get 10% bonus</p>
          </div>
          <div className="floating-card">
            <div className="card-icon">🎯</div>
            <h4>PSN Cards</h4>
            <p>Instant delivery</p>
          </div>
          <div className="floating-card">
            <div className="card-icon">⚡</div>
            <h4>Xbox Live</h4>
            <p>Best deals</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>{t("mostPopularProducts")}</h2>
          <p>{t("mostPopularGamingCodes")}</p>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-badge">{product.discount}</div>
              <div className="product-icon">{product.image}</div>
              <div className="product-category">{product.category}</div>
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">{product.price}</div>
              <button className="btn btn-primary btn-small" onClick={() => navigate("/products")}>{t("buyNow")}</button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>{t("howItWorks")}</h2>
          <p>{t("getCodesInSteps")}</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h4>{t("chooseYourCode")}</h4>
            <p>{t("selectFromVarious")}</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>{t("completePayment")}</h4>
            <p>{t("securePaymentOptions")}</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>{t("instantDelivery")}</h4>
            <p>{t("receiveCodeInstantly")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}