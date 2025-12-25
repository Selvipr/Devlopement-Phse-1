// src/pages/RefundPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaArrowLeft, FaUndo, FaClock, FaCheckCircle } from 'react-icons/fa';
import './RefundPolicy.css';

export default function RefundPolicy() {
  const { t, language } = useLanguage();

  const content = {
    en: {
      title: "Refund Policy",
      lastUpdated: "Last Updated: December 20, 2025",
      intro: "At GameStore, we want you to be completely satisfied with your purchase. This Refund Policy outlines the terms and conditions for refunds.",
      sections: [
        {
          title: "Refund Eligibility",
          content: [
            "Refunds are available within 7 days of purchase.",
            "The digital code must be unused and unredeemed.",
            "Refund requests must include your order number.",
            "Refunds are processed to the original payment method."
          ]
        },
        {
          title: "How to Request a Refund",
          content: [
            "Contact our support team at support@gamestore.com",
            "Include your order number in the email subject line",
            "Provide a brief reason for the refund request",
            "Our team will review your request within 24-48 hours"
          ]
        },
        {
          title: "Processing Time",
          content: [
            "Refund requests are reviewed within 24-48 hours",
            "Approved refunds are processed within 5-10 business days",
            "You will receive an email confirmation when the refund is processed",
            "Refunds appear in your account based on your payment provider's processing time"
          ]
        },
        {
          title: "Non-Refundable Items",
          content: [
            "Used or redeemed digital codes",
            "Codes purchased more than 7 days ago",
            "Codes that have been partially used",
            "Purchases made with promotional codes or discounts (unless code is defective)"
          ]
        },
        {
          title: "Defective Codes",
          content: [
            "If you receive a defective or invalid code, contact us immediately",
            "We will verify the issue and provide a replacement code or full refund",
            "Defective code refunds are not subject to the 7-day limit",
            "We guarantee all codes are valid at the time of purchase"
          ]
        },
        {
          title: "Contact Us",
          content: [
            "For refund inquiries, please contact:",
            "Email: support@gamestore.com",
            "Phone: +1 (555) 123-4567",
            "Response time: Within 24-48 hours"
          ]
        }
      ]
    },
    ru: {
      title: "Политика возврата",
      lastUpdated: "Последнее обновление: 20 декабря 2025",
      intro: "В GameStore мы хотим, чтобы вы были полностью довольны своей покупкой. Эта Политика возврата описывает условия и положения для возврата средств.",
      sections: [
        {
          title: "Право на возврат",
          content: [
            "Возврат средств доступен в течение 7 дней с момента покупки.",
            "Цифровой код должен быть неиспользованным и неактивированным.",
            "Запросы на возврат должны включать номер вашего заказа.",
            "Возврат средств обрабатывается на исходный способ оплаты."
          ]
        },
        {
          title: "Как запросить возврат",
          content: [
            "Свяжитесь с нашей службой поддержки по адресу support@gamestore.com",
            "Укажите номер вашего заказа в теме письма",
            "Укажите краткую причину запроса на возврат",
            "Наша команда рассмотрит ваш запрос в течение 24-48 часов"
          ]
        },
        {
          title: "Время обработки",
          content: [
            "Запросы на возврат рассматриваются в течение 24-48 часов",
            "Одобренные возвраты обрабатываются в течение 5-10 рабочих дней",
            "Вы получите подтверждение по электронной почте, когда возврат будет обработан",
            "Возвраты появляются в вашем аккаунте в зависимости от времени обработки вашего платежного провайдера"
          ]
        },
        {
          title: "Невозвратные товары",
          content: [
            "Использованные или активированные цифровые коды",
            "Коды, приобретенные более 7 дней назад",
            "Коды, которые были частично использованы",
            "Покупки, сделанные с промокодами или скидками (если код не дефектный)"
          ]
        },
        {
          title: "Дефектные коды",
          content: [
            "Если вы получили дефектный или недействительный код, немедленно свяжитесь с нами",
            "Мы проверим проблему и предоставим замену кода или полный возврат средств",
            "Возвраты за дефектные коды не подпадают под ограничение в 7 дней",
            "Мы гарантируем, что все коды действительны на момент покупки"
          ]
        },
        {
          title: "Свяжитесь с нами",
          content: [
            "По вопросам возврата, пожалуйста, свяжитесь:",
            "Электронная почта: support@gamestore.com",
            "Телефон: +1 (555) 123-4567",
            "Время ответа: В течение 24-48 часов"
          ]
        }
      ]
    }
  };

  const pageContent = content[language] || content.en;

  return (
    <div className="refund-policy-container">
      <div className="refund-policy-content">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
        
        <div className="refund-header">
          <div className="header-icon">
            <FaUndo />
          </div>
          <h1>{pageContent.title}</h1>
          <p className="last-updated">{pageContent.lastUpdated}</p>
        </div>

        <div className="refund-intro">
          <p>{pageContent.intro}</p>
        </div>

        <div className="refund-sections">
          {pageContent.sections.map((section, index) => (
            <section key={index} className="refund-section">
              <h2>
                {index === 0 && <FaCheckCircle />}
                {index === 1 && <FaClock />}
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

        <div className="refund-footer">
          <p>We're committed to ensuring your satisfaction with every purchase.</p>
        </div>
      </div>
    </div>
  );
}

