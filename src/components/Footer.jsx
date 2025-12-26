// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaGamepad, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary-dark pt-16 pb-8 border-t border-white/5 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <FaGamepad className="text-2xl text-accent" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Digital Market</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted marketplace for instant digital gaming top-ups and gift cards. Fast, secure, and reliable delivery 24/7.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-primary transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { to: "/", label: t('home') },
                { to: "/products", label: t('products') },
                { to: "/orders", label: t('orders') },
                { to: "/cart", label: t('cart') }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-sm hover:text-accent transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Legal</h3>
            <ul className="space-y-4">
              {[
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms-of-service", label: "Terms of Service" },
                { to: "/refund-policy", label: "Refund Policy" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-sm hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group">
                <FaEnvelope className="mt-1 text-accent group-hover:text-white transition-colors" />
                <span className="text-sm">support@digitalmarket.com</span>
              </li>
              <li className="flex items-start space-x-4 group">
                <FaPhone className="mt-1 text-accent group-hover:text-white transition-colors" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-4 group">
                <FaMapMarkerAlt className="mt-1 text-accent group-hover:text-white transition-colors" />
                <span className="text-sm">123 Gaming Street, Digital City, DC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Digital Market Labs. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Digital Market is not affiliated with any game developers. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
