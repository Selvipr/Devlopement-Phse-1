// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaHome, FaGamepad, FaClipboardList, FaCog, FaSignOutAlt, FaChevronDown, FaSun, FaMoon, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const { getItemCount } = useCart();
  const {
    language,
    languages,
    currency,
    currencies,
    t,
    formatPrice,
    changeLanguage,
    changeCurrency
  } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, signOut, profile } = useAuth();

  const navigate = useNavigate();

  // State for dropdowns
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  // Refs for handling click outside
  const profileMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target)) {
        setShowCurrencyMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <FaGamepad className="logo-icon" />
          <span className="logo-text">GameStore</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" />
            <span className="nav-text">{t('home')}</span>
          </Link>

          <Link to="/products" className="nav-link">
            <FaGamepad className="nav-icon" />
            <span className="nav-text">{t('products')}</span>
          </Link>

          <Link to="/orders" className="nav-link">
            <FaClipboardList className="nav-icon" />
            <span className="nav-text">{t('orders')}</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="nav-right">
          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>

          {/* Language Selector */}
          <div className="nav-selector" ref={languageMenuRef}>
            <button
              className="selector-btn"
              onClick={() => {
                setShowLanguageMenu(!showLanguageMenu);
                setShowCurrencyMenu(false);
                setShowProfileMenu(false);
              }}
              title={t('selectLanguage')}
            >
              <span className="selector-icon">
                {languages.find(l => l.code === language)?.flag || '🌐'}
              </span>
              <span className="selector-text">
                {languages.find(l => l.code === language)?.code.toUpperCase() || 'EN'}
              </span>
              <FaChevronDown className={`chevron ${showLanguageMenu ? 'rotate' : ''}`} />
            </button>

            {showLanguageMenu && (
              <div className="dropdown-menu">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className={`dropdown-item ${language === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                  >
                    <span className="dropdown-icon">{lang.flag}</span>
                    <span className="dropdown-text">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="nav-selector" ref={currencyMenuRef}>
            <button
              className="selector-btn"
              onClick={() => {
                setShowCurrencyMenu(!showCurrencyMenu);
                setShowLanguageMenu(false);
                setShowProfileMenu(false);
              }}
              title={t('selectCurrency')}
            >
              <span className="selector-icon">
                {currencies.find(c => c.code === currency)?.symbol || '$'}
              </span>
              <span className="selector-text">
                {currency || 'USD'}
              </span>
              <FaChevronDown className={`chevron ${showCurrencyMenu ? 'rotate' : ''}`} />
            </button>

            {showCurrencyMenu && (
              <div className="dropdown-menu">
                {currencies.map(curr => (
                  <button
                    key={curr.code}
                    className={`dropdown-item ${currency === curr.code ? 'active' : ''}`}
                    onClick={() => {
                      changeCurrency(curr.code);
                      setShowCurrencyMenu(false);
                    }}
                  >
                    <span className="dropdown-icon">{curr.symbol}</span>
                    <span className="dropdown-text">{curr.code} - {curr.name}</span>
                    <span className="dropdown-rate">Rate: {curr.rate}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Link */}
          <Link to="/cart" className="cart-link">
            <div className="cart-icon-container">
              <FaShoppingCart className="cart-icon" />
              {getItemCount() > 0 && (
                <span className="cart-badge">{getItemCount()}</span>
              )}
            </div>
            <span className="cart-text">{t('cart')}</span>
          </Link>

          {/* Profile Dropdown or Login/Register */}
          {user ? (
            <div className="profile-container" ref={profileMenuRef}>
              <button
                className="profile-btn"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowLanguageMenu(false);
                  setShowCurrencyMenu(false);
                }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="profile-avatar-img" />
                ) : (
                  <FaUser className="profile-icon" />
                )}
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu profile-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Avatar" />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{profile?.full_name || user.email.split('@')[0]}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaUser className="dropdown-item-icon" />
                    <span>{t('myProfile')}</span>
                  </Link>

                  <Link
                    to="/orders"
                    className="dropdown-item"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaClipboardList className="dropdown-item-icon" />
                    <span>{t('myOrders')}</span>
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      signOut();
                      setShowProfileMenu(false);
                      navigate('/login');
                    }}
                  >
                    <FaSignOutAlt className="dropdown-item-icon" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-btn login-btn">
                <FaSignInAlt /> {t('login') || 'Login'}
              </Link>
              <Link to="/register" className="nav-btn register-btn">
                <FaUserPlus /> {t('register') || 'Register'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}