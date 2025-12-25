// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaGamepad, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <FaGamepad className="logo-icon" />
              <span className="logo-text">GameStore</span>
            </div>
            <p className="footer-description">
              Your trusted source for instant digital gaming codes. Fast delivery, best prices, and 100% guaranteed working codes.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <FaFacebook />
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/products">{t('products')}</Link></li>
              <li><Link to="/orders">{t('orders')}</Link></li>
              <li><Link to="/cart">{t('cart')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <FaEnvelope />
                <span>support@gamestore.com</span>
              </li>
              <li>
                <FaPhone />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>123 Gaming Street, Digital City, DC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GameStore. All rights reserved.</p>
          <p className="footer-disclaimer">
            GameStore is not affiliated with Steam, PlayStation, Xbox, Nintendo, or any other gaming platform.
          </p>
        </div>
      </div>
    </footer>
  );
}

