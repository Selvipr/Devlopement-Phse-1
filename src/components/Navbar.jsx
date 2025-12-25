// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaHome, FaGamepad, FaClipboardList, FaSignOutAlt, FaChevronDown, FaSun, FaMoon, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const { getItemCount } = useCart();
  const {
    language,
    languages,
    currency,
    currencies,
    t,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-sm border-b border-white/10 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
            <div className="p-2 bg-accent rounded-lg group-hover:bg-accent-hover transition-colors">
              <FaGamepad className="text-xl text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Quantix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-accent transition-colors">
              <FaHome />
              <span>{t('home')}</span>
            </Link>
            <Link to="/products" className="flex items-center space-x-2 text-gray-300 hover:text-accent transition-colors">
              <FaGamepad />
              <span>{t('products')}</span>
            </Link>
            <Link to="/orders" className="flex items-center space-x-2 text-gray-300 hover:text-accent transition-colors">
              <FaClipboardList />
              <span>{t('orders')}</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-accent transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            {/* Language Selector */}
            <div className="relative" ref={languageMenuRef}>
              <button
                className="flex items-center space-x-1 p-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  setShowLanguageMenu(!showLanguageMenu);
                  setShowCurrencyMenu(false);
                  setShowProfileMenu(false);
                }}
              >
                <span>{languages.find(l => l.code === language)?.flag || '🌐'}</span>
                <span className="uppercase text-sm font-medium">{language || 'EN'}</span>
                <FaChevronDown className={`text-xs transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-surface border border-white/10 rounded-md shadow-xl py-1 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-white/5 transition-colors ${language === lang.code ? 'text-accent' : 'text-gray-300'}`}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative" ref={currencyMenuRef}>
              <button
                className="flex items-center space-x-1 p-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  setShowCurrencyMenu(!showCurrencyMenu);
                  setShowLanguageMenu(false);
                  setShowProfileMenu(false);
                }}
              >
                <span className="text-accent font-medium">{currencies.find(c => c.code === currency)?.symbol || '$'}</span>
                <span className="text-sm font-medium">{currency || 'USD'}</span>
                <FaChevronDown className={`text-xs transition-transform ${showCurrencyMenu ? 'rotate-180' : ''}`} />
              </button>

              {showCurrencyMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-md shadow-xl py-1 z-50">
                  {currencies.map(curr => (
                    <button
                      key={curr.code}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-white/5 transition-colors ${currency === curr.code ? 'text-accent' : 'text-gray-300'}`}
                      onClick={() => {
                        changeCurrency(curr.code);
                        setShowCurrencyMenu(false);
                      }}
                    >
                      <div>
                        <span className="mr-2 font-bold">{curr.symbol}</span>
                        <span>{curr.code}</span>
                      </div>
                      <span className="text-xs text-gray-500">{curr.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Link */}
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-accent transition-colors group">
              <FaShoppingCart className="text-lg" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-primary">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {/* Profile / Auth */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowLanguageMenu(false);
                    setShowCurrencyMenu(false);
                  }}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-yellow-300 p-[2px]">
                    <div className="w-full h-full rounded-full bg-surface overflow-hidden flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-surface border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-accent" onClick={() => setShowProfileMenu(false)}>
                        <FaUser className="mr-3 text-gray-400" /> {t('myProfile')}
                      </Link>
                      <Link to="/orders" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-accent" onClick={() => setShowProfileMenu(false)}>
                        <FaClipboardList className="mr-3 text-gray-400" /> {t('myOrders')}
                      </Link>
                    </div>

                    <div className="border-t border-white/10 pt-1">
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300"
                        onClick={() => {
                          signOut();
                          setShowProfileMenu(false);
                          navigate('/login');
                        }}
                      >
                        <FaSignOutAlt className="mr-3" /> {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  {t('login') || 'Login'}
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold text-primary bg-accent rounded-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
                  {t('register') || 'Sign Up'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-accent transition-colors">
              <FaShoppingCart className="text-lg" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-primary">
                  {getItemCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-white/10">
          <div className="px-4 py-2 space-y-1">
            <Link to="/" onClick={closeMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
              <div className="flex items-center space-x-3">
                <FaHome /> <span>{t('home')}</span>
              </div>
            </Link>
            <Link to="/products" onClick={closeMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
              <div className="flex items-center space-x-3">
                <FaGamepad /> <span>{t('products')}</span>
              </div>
            </Link>
            <Link to="/orders" onClick={closeMobileMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
              <div className="flex items-center space-x-3">
                <FaClipboardList /> <span>{t('orders')}</span>
              </div>
            </Link>
          </div>

          <div className="border-t border-white/10 px-4 py-4 space-y-4">
            {!user ? (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/login" onClick={closeMobileMenu} className="flex items-center justify-center px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5">
                  {t('login') || 'Login'}
                </Link>
                <Link to="/register" onClick={closeMobileMenu} className="flex items-center justify-center px-4 py-2 rounded-lg bg-accent text-primary font-bold hover:bg-accent-hover">
                  {t('register') || 'Sign Up'}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 px-3">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <FaUser className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="text-white font-medium">{profile?.full_name || 'User'}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </div>
                <button onClick={() => { signOut(); closeMobileMenu(); }} className="w-full flex items-center px-3 py-2 text-red-400 hover:bg-white/5 rounded-md">
                  <FaSignOutAlt className="mr-3" /> {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}