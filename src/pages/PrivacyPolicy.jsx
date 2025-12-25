// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaArrowLeft, FaShieldAlt, FaLock, FaUserShield } from 'react-icons/fa';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  const { t, language } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: December 20, 2025",
      intro: "At GameStore, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.",
      sections: [
        {
          title: "Information We Collect",
          content: [
            "Personal Information: Name, email address, phone number, billing address, and payment information.",
            "Usage Data: Information about how you access and use our website, including IP address, browser type, pages visited, and time spent on pages.",
            "Cookies: We use cookies to enhance your experience, analyze site traffic, and personalize content."
          ]
        },
        {
          title: "How We Use Your Information",
          content: [
            "To process and fulfill your orders",
            "To communicate with you about your orders and account",
            "To improve our website and services",
            "To send promotional emails (with your consent)",
            "To detect and prevent fraud",
            "To comply with legal obligations"
          ]
        },
        {
          title: "Data Security",
          content: [
            "We implement industry-standard security measures to protect your personal information.",
            "All payment transactions are encrypted using SSL technology.",
            "We do not store your complete credit card information on our servers.",
            "Your data is stored securely and accessed only by authorized personnel."
          ]
        },
        {
          title: "Sharing Your Information",
          content: [
            "We do not sell your personal information to third parties.",
            "We may share information with service providers who assist in operating our website and conducting our business.",
            "We may disclose information if required by law or to protect our rights."
          ]
        },
        {
          title: "Your Rights",
          content: [
            "You have the right to access your personal information",
            "You can request correction of inaccurate data",
            "You can request deletion of your data",
            "You can opt-out of marketing communications",
            "You can request a copy of your data"
          ]
        },
        {
          title: "Cookies",
          content: [
            "We use cookies to improve your browsing experience.",
            "You can control cookies through your browser settings.",
            "Disabling cookies may affect website functionality."
          ]
        },
        {
          title: "Children's Privacy",
          content: [
            "Our services are not intended for children under 13 years of age.",
            "We do not knowingly collect personal information from children."
          ]
        },
        {
          title: "Changes to This Policy",
          content: [
            "We may update this Privacy Policy from time to time.",
            "We will notify you of any changes by posting the new policy on this page.",
            "Changes are effective immediately upon posting."
          ]
        },
        {
          title: "Contact Us",
          content: [
            "If you have questions about this Privacy Policy, please contact us:",
            "Email: privacy@gamestore.com",
            "Phone: +1 (555) 123-4567",
            "Address: 123 Gaming Street, Digital City, DC 12345"
          ]
        }
      ]
    },
    ru: {
      title: "Политика конфиденциальности",
      lastUpdated: "Последнее обновление: 20 декабря 2025",
      intro: "В GameStore мы стремимся защищать вашу конфиденциальность. Эта Политика конфиденциальности объясняет, как мы собираем, используем, раскрываем и защищаем вашу информацию при посещении нашего веб-сайта.",
      sections: [
        {
          title: "Информация, которую мы собираем",
          content: [
            "Личная информация: имя, адрес электронной почты, номер телефона, адрес для выставления счетов и платежная информация.",
            "Данные об использовании: информация о том, как вы получаете доступ и используете наш веб-сайт, включая IP-адрес, тип браузера, посещенные страницы и время, проведенное на страницах.",
            "Файлы cookie: мы используем файлы cookie для улучшения вашего опыта, анализа трафика сайта и персонализации контента."
          ]
        },
        {
          title: "Как мы используем вашу информацию",
          content: [
            "Для обработки и выполнения ваших заказов",
            "Для связи с вами по поводу ваших заказов и учетной записи",
            "Для улучшения нашего веб-сайта и услуг",
            "Для отправки рекламных писем (с вашего согласия)",
            "Для обнаружения и предотвращения мошенничества",
            "Для соблюдения юридических обязательств"
          ]
        },
        {
          title: "Безопасность данных",
          content: [
            "Мы применяем стандартные меры безопасности для защиты вашей личной информации.",
            "Все платежные транзакции зашифрованы с использованием технологии SSL.",
            "Мы не храним полную информацию о вашей кредитной карте на наших серверах.",
            "Ваши данные хранятся безопасно и доступны только авторизованному персоналу."
          ]
        },
        {
          title: "Обмен вашей информацией",
          content: [
            "Мы не продаем вашу личную информацию третьим лицам.",
            "Мы можем делиться информацией с поставщиками услуг, которые помогают в работе нашего веб-сайта и ведении бизнеса.",
            "Мы можем раскрывать информацию, если это требуется по закону или для защиты наших прав."
          ]
        },
        {
          title: "Ваши права",
          content: [
            "Вы имеете право на доступ к вашей личной информации",
            "Вы можете запросить исправление неточных данных",
            "Вы можете запросить удаление ваших данных",
            "Вы можете отказаться от маркетинговых сообщений",
            "Вы можете запросить копию ваших данных"
          ]
        },
        {
          title: "Файлы cookie",
          content: [
            "Мы используем файлы cookie для улучшения вашего опыта просмотра.",
            "Вы можете управлять файлами cookie через настройки браузера.",
            "Отключение файлов cookie может повлиять на функциональность веб-сайта."
          ]
        },
        {
          title: "Конфиденциальность детей",
          content: [
            "Наши услуги не предназначены для детей младше 13 лет.",
            "Мы не собираем намеренно личную информацию от детей."
          ]
        },
        {
          title: "Изменения в этой политике",
          content: [
            "Мы можем время от времени обновлять эту Политику конфиденциальности.",
            "Мы уведомим вас о любых изменениях, разместив новую политику на этой странице.",
            "Изменения вступают в силу немедленно после публикации."
          ]
        },
        {
          title: "Свяжитесь с нами",
          content: [
            "Если у вас есть вопросы об этой Политике конфиденциальности, пожалуйста, свяжитесь с нами:",
            "Электронная почта: privacy@gamestore.com",
            "Телефон: +1 (555) 123-4567",
            "Адрес: 123 Gaming Street, Digital City, DC 12345"
          ]
        }
      ]
    }
  };

  const pageContent = content[language] || content.en;

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-content">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
        
        <div className="policy-header">
          <div className="header-icon">
            <FaShieldAlt />
          </div>
          <h1>{pageContent.title}</h1>
          <p className="last-updated">{pageContent.lastUpdated}</p>
        </div>

        <div className="policy-intro">
          <p>{pageContent.intro}</p>
        </div>

        <div className="policy-sections">
          {pageContent.sections.map((section, index) => (
            <section key={index} className="policy-section">
              <h2>
                {index === 0 && <FaLock />}
                {index === 1 && <FaUserShield />}
                {section.title}
              </h2>
              <ul>
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="policy-footer">
          <p>Thank you for trusting GameStore with your information.</p>
        </div>
      </div>
    </div>
  );
}

