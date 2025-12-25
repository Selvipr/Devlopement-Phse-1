// src/pages/TermsOfService.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaArrowLeft, FaFileContract, FaGavel, FaExclamationTriangle } from 'react-icons/fa';
import './TermsOfService.css';

export default function TermsOfService() {
  const { t, language } = useLanguage();

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: December 20, 2025",
      intro: "Please read these Terms of Service carefully before using GameStore. By accessing or using our service, you agree to be bound by these Terms.",
      sections: [
        {
          title: "Acceptance of Terms",
          content: [
            "By accessing and using GameStore, you accept and agree to be bound by the terms and provision of this agreement.",
            "If you do not agree to these Terms, please do not use our service."
          ]
        },
        {
          title: "Use License",
          content: [
            "Permission is granted to temporarily access the materials on GameStore for personal, non-commercial transitory viewing only.",
            "This is the grant of a license, not a transfer of title, and under this license you may not:",
            "• Modify or copy the materials",
            "• Use the materials for any commercial purpose",
            "• Attempt to reverse engineer any software contained on GameStore",
            "• Remove any copyright or other proprietary notations from the materials"
          ]
        },
        {
          title: "Digital Products",
          content: [
            "All digital products sold are for personal use only.",
            "Digital codes are delivered instantly via email after successful payment.",
            "All sales are final. Refunds are available only within 7 days of purchase if the code is unused.",
            "We guarantee that all codes are valid and unused at the time of purchase.",
            "You are responsible for redeeming codes promptly after purchase."
          ]
        },
        {
          title: "Payment Terms",
          content: [
            "All prices are displayed in the selected currency.",
            "Payment must be completed before digital codes are delivered.",
            "We accept major credit cards, debit cards, and PayPal.",
            "All transactions are processed securely through encrypted payment gateways.",
            "Prices are subject to change without notice."
          ]
        },
        {
          title: "User Accounts",
          content: [
            "You are responsible for maintaining the confidentiality of your account credentials.",
            "You agree to notify us immediately of any unauthorized use of your account.",
            "We reserve the right to suspend or terminate accounts that violate these Terms.",
            "You must be at least 18 years old to create an account and make purchases."
          ]
        },
        {
          title: "Prohibited Uses",
          content: [
            "You may not use our service for any unlawful purpose.",
            "You may not attempt to gain unauthorized access to our systems.",
            "You may not use automated systems to access our website.",
            "You may not resell digital codes purchased from GameStore.",
            "You may not use our service to transmit any harmful code or malware."
          ]
        },
        {
          title: "Intellectual Property",
          content: [
            "All content on GameStore, including text, graphics, logos, and software, is the property of GameStore or its content suppliers.",
            "You may not reproduce, distribute, or create derivative works from our content without written permission.",
            "All trademarks and registered trademarks are the property of their respective owners."
          ]
        },
        {
          title: "Limitation of Liability",
          content: [
            "GameStore shall not be liable for any indirect, incidental, special, or consequential damages.",
            "Our total liability for any claim shall not exceed the amount you paid for the product.",
            "We do not guarantee uninterrupted or error-free service.",
            "We are not responsible for any loss or damage resulting from the use of purchased digital codes."
          ]
        },
        {
          title: "Refund Policy",
          content: [
            "Refunds are available within 7 days of purchase if the digital code is unused.",
            "To request a refund, contact our support team with your order number.",
            "Refunds will be processed to the original payment method within 5-10 business days.",
            "Refunds are not available for used or redeemed codes."
          ]
        },
        {
          title: "Modifications",
          content: [
            "We reserve the right to modify these Terms at any time.",
            "Changes will be effective immediately upon posting on this page.",
            "Your continued use of the service after changes constitutes acceptance of the new Terms.",
            "We recommend reviewing these Terms periodically."
          ]
        },
        {
          title: "Governing Law",
          content: [
            "These Terms shall be governed by and construed in accordance with applicable laws.",
            "Any disputes arising from these Terms shall be resolved through binding arbitration.",
            "You agree to submit to the jurisdiction of the courts in our jurisdiction."
          ]
        },
        {
          title: "Contact Information",
          content: [
            "If you have any questions about these Terms of Service, please contact us:",
            "Email: legal@gamestore.com",
            "Phone: +1 (555) 123-4567",
            "Address: 123 Gaming Street, Digital City, DC 12345"
          ]
        }
      ]
    },
    ru: {
      title: "Условия использования",
      lastUpdated: "Последнее обновление: 20 декабря 2025",
      intro: "Пожалуйста, внимательно прочитайте эти Условия использования перед использованием GameStore. Получая доступ к нашему сервису или используя его, вы соглашаетесь соблюдать эти Условия.",
      sections: [
        {
          title: "Принятие условий",
          content: [
            "Получая доступ и используя GameStore, вы принимаете и соглашаетесь соблюдать условия и положения этого соглашения.",
            "Если вы не согласны с этими Условиями, пожалуйста, не используйте наш сервис."
          ]
        },
        {
          title: "Лицензия на использование",
          content: [
            "Разрешение предоставляется для временного доступа к материалам на GameStore только для личного, некоммерческого временного просмотра.",
            "Это предоставление лицензии, а не передача права собственности, и в рамках этой лицензии вы не можете:",
            "• Изменять или копировать материалы",
            "• Использовать материалы в коммерческих целях",
            "• Пытаться провести обратную разработку любого программного обеспечения, содержащегося на GameStore",
            "• Удалять любые авторские права или другие проприетарные обозначения из материалов"
          ]
        },
        {
          title: "Цифровые продукты",
          content: [
            "Все продаваемые цифровые продукты предназначены только для личного использования.",
            "Цифровые коды доставляются мгновенно по электронной почте после успешной оплаты.",
            "Все продажи окончательны. Возврат средств доступен только в течение 7 дней с момента покупки, если код не использован.",
            "Мы гарантируем, что все коды действительны и не использованы на момент покупки.",
            "Вы несете ответственность за своевременное использование кодов после покупки."
          ]
        },
        {
          title: "Условия оплаты",
          content: [
            "Все цены отображаются в выбранной валюте.",
            "Оплата должна быть завершена до доставки цифровых кодов.",
            "Мы принимаем основные кредитные карты, дебетовые карты и PayPal.",
            "Все транзакции обрабатываются безопасно через зашифрованные платежные шлюзы.",
            "Цены могут изменяться без уведомления."
          ]
        },
        {
          title: "Пользовательские учетные записи",
          content: [
            "Вы несете ответственность за сохранение конфиденциальности учетных данных вашей учетной записи.",
            "Вы соглашаетесь немедленно уведомить нас о любом несанкционированном использовании вашей учетной записи.",
            "Мы оставляем за собой право приостановить или прекратить учетные записи, нарушающие эти Условия.",
            "Вам должно быть не менее 18 лет, чтобы создать учетную запись и совершать покупки."
          ]
        },
        {
          title: "Запрещенное использование",
          content: [
            "Вы не можете использовать наш сервис в незаконных целях.",
            "Вы не можете пытаться получить несанкционированный доступ к нашим системам.",
            "Вы не можете использовать автоматизированные системы для доступа к нашему веб-сайту.",
            "Вы не можете перепродавать цифровые коды, приобретенные в GameStore.",
            "Вы не можете использовать наш сервис для передачи вредоносного кода или вредоносного ПО."
          ]
        },
        {
          title: "Интеллектуальная собственность",
          content: [
            "Весь контент на GameStore, включая текст, графику, логотипы и программное обеспечение, является собственностью GameStore или его поставщиков контента.",
            "Вы не можете воспроизводить, распространять или создавать производные работы из нашего контента без письменного разрешения.",
            "Все товарные знаки и зарегистрированные товарные знаки являются собственностью их соответствующих владельцев."
          ]
        },
        {
          title: "Ограничение ответственности",
          content: [
            "GameStore не несет ответственности за любые косвенные, случайные, специальные или последующие убытки.",
            "Наша общая ответственность по любому иску не должна превышать сумму, которую вы заплатили за продукт.",
            "Мы не гарантируем бесперебойную или безошибочную работу сервиса.",
            "Мы не несем ответственности за любые потери или ущерб, возникшие в результате использования приобретенных цифровых кодов."
          ]
        },
        {
          title: "Политика возврата",
          content: [
            "Возврат средств доступен в течение 7 дней с момента покупки, если цифровой код не использован.",
            "Чтобы запросить возврат средств, свяжитесь с нашей службой поддержки с номером вашего заказа.",
            "Возврат средств будет обработан на исходный способ оплаты в течение 5-10 рабочих дней.",
            "Возврат средств недоступен для использованных или активированных кодов."
          ]
        },
        {
          title: "Изменения",
          content: [
            "Мы оставляем за собой право изменять эти Условия в любое время.",
            "Изменения вступают в силу немедленно после публикации на этой странице.",
            "Ваше дальнейшее использование сервиса после изменений означает принятие новых Условий.",
            "Мы рекомендуем периодически просматривать эти Условия."
          ]
        },
        {
          title: "Применимое право",
          content: [
            "Эти Условия регулируются и толкуются в соответствии с применимым законодательством.",
            "Любые споры, возникающие из этих Условий, должны решаться путем обязательного арбитража.",
            "Вы соглашаетесь подчиниться юрисдикции судов в нашей юрисдикции."
          ]
        },
        {
          title: "Контактная информация",
          content: [
            "Если у вас есть вопросы об этих Условиях использования, пожалуйста, свяжитесь с нами:",
            "Электронная почта: legal@gamestore.com",
            "Телефон: +1 (555) 123-4567",
            "Адрес: 123 Gaming Street, Digital City, DC 12345"
          ]
        }
      ]
    }
  };

  const pageContent = content[language] || content.en;

  return (
    <div className="terms-container">
      <div className="terms-content">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
        
        <div className="terms-header">
          <div className="header-icon">
            <FaFileContract />
          </div>
          <h1>{pageContent.title}</h1>
          <p className="last-updated">{pageContent.lastUpdated}</p>
        </div>

        <div className="terms-intro">
          <FaExclamationTriangle className="warning-icon" />
          <p>{pageContent.intro}</p>
        </div>

        <div className="terms-sections">
          {pageContent.sections.map((section, index) => (
            <section key={index} className="terms-section">
              <h2>
                {index === 0 && <FaGavel />}
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

        <div className="terms-footer">
          <p>By using GameStore, you acknowledge that you have read and understood these Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}

