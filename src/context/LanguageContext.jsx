// src/context/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    home: "Home",
    products: "Products",
    orders: "Orders",
    register: "Register",
    login: "Login",
    cart: "Cart",
    teamMembers: "Team Members",
    viewAll: "View All",
    selectLanguage: "Select Language",
    selectCurrency: "Select Currency",
    shoppingCart: "Shopping Cart",
    items: "items",
    item: "item",
    emptyCart: "Your cart is empty",
    browseProducts: "Browse Products",
    total: "Total",
    viewCart: "View Cart",
    checkout: "Checkout",
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    name: "Name",
    cancel: "Cancel",
    changePhoto: "Change Photo",
    memberSince: "Member Since",
    totalOrders: "Total Orders",
    rating: "Rating",
    myOrders: "My Orders",
    settings: "Settings",
    logout: "Logout",
    profile: "Profile",
    signUp: "Sign Up",
    featuredCategories: "Featured Categories",
    chooseFromCategories: "Choose from our top digital product categories",
    backToCategories: "Back to Categories",
    allProducts: "All Products",
    showingProducts: "Showing {count} products for {name}",
    sortBy: "Sort by",
    mostPopular: "Most Popular",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    highestRated: "Highest Rated",
    addToCart: "Add to Cart",
    viewDetails: "View Details",
    buyNow: "Buy Now",
    instantDelivery: "Instant Delivery",
    inStock: "In Stock",
    lowStock: "Low Stock",
    save: "Save",
    platform: "Platform",
    delivery: "Delivery",
    popularItems: "Popular Items",
    totalProducts: "Total Products",
    fastestDelivery: "Fastest Delivery",
    customerRating: "Customer Rating",
    categories: "Categories",
    productDetails: "Product Details",
    description: "Description",
    quantity: "Quantity",
    continueShopping: "Continue Shopping",
    placeOrder: "Place Order",
    priceDetails: "Price Details",
    deliveryCharges: "Delivery Charges",
    free: "FREE",
    discount: "Discount",
    totalAmount: "Total Amount",
    enterCouponCode: "Enter coupon code",
    apply: "Apply",
    availableCoupons: "Available Coupons",
    safeSecurePayments: "Safe and Secure Payments",
    instantDigitalDelivery: "Instant Digital Delivery",
    refundPolicy: "7-Day Refund Policy",
    manageTrackPurchases: "Manage and track your digital purchases",
    allOrders: "All Orders",
    completed: "Completed",
    pending: "Pending",
    processing: "Processing",
    refunded: "Refunded",
    order: "Order",
    orderDate: "Order Date",
    showCodes: "Show Codes",
    hideCodes: "Hide Codes",
    downloadInvoice: "Download Invoice",
    yourRedeemCodes: "Your Redeem Codes",
    copy: "Copy",
    noOrdersFound: "No orders found",
    noOrdersCategory: "You haven't placed any orders in this category yet.",
    startShopping: "Start Shopping",
    instantDigitalGamingCodes: "Instant Digital Gaming Codes",
    getInstantAccess: "Get instant access to Steam, PlayStation, Xbox, and more gaming codes. Fast delivery, best prices, and 100% guaranteed working codes.",
    shopNow: "Shop Now",
    howItWorks: "How It Works",
    getCodesInSteps: "Get your codes in 3 simple steps",
    chooseYourCode: "Choose Your Code",
    selectFromVarious: "Select from various gaming and entertainment codes",
    completePayment: "Complete Payment",
    securePaymentOptions: "Secure payment with multiple options available",
    receiveCodeInstantly: "Receive your code instantly via email",
    mostPopularProducts: "Most popular products",
    mostPopularGamingCodes: "Most popular gaming codes",
    happyCustomers: "Happy Customers",
    codesDelivered: "Codes Delivered",
    successRate: "Success Rate",
    customerSupport: "Customer Support"
  },
  ru: {
    home: "Главная",
    products: "Товары",
    orders: "Заказы",
    register: "Регистрация",
    login: "Вход",
    cart: "Корзина",
    teamMembers: "Команда",
    viewAll: "Посмотреть всех",
    selectLanguage: "Выбрать язык",
    selectCurrency: "Выбрать валюту",
    shoppingCart: "Корзина",
    items: "товаров",
    item: "товар",
    emptyCart: "Ваша корзина пуста",
    browseProducts: "Найти товары",
    total: "Итого",
    viewCart: "Просмотр корзины",
    checkout: "Оформить заказ",
    myProfile: "Мой профиль",
    editProfile: "Редактировать профиль",
    name: "Имя",
    cancel: "Отмена",
    changePhoto: "Изменить фото",
    memberSince: "Дата регистрации",
    totalOrders: "Всего заказов",
    rating: "Рейтинг",
    myOrders: "Мои заказы",
    settings: "Настройки",
    logout: "Выход",
    profile: "Профиль",
    signUp: "Регистрация",
    featuredCategories: "Рекомендуемые категории",
    chooseFromCategories: "Выберите из наших лучших категорий цифровых продуктов",
    backToCategories: "Назад к категориям",
    allProducts: "Все товары",
    showingProducts: "Показано {count} товаров для {name}",
    sortBy: "Сортировать по",
    mostPopular: "Самые популярные",
    priceLowToHigh: "Цена: от низкой к высокой",
    priceHighToLow: "Цена: от высокой к низкой",
    highestRated: "Самые рейтинговые",
    addToCart: "Добавить в корзину",
    viewDetails: "Подробности",
    buyNow: "Купить сейчас",
    instantDelivery: "Мгновенная доставка",
    inStock: "В наличии",
    lowStock: "Мало в наличии",
    save: "Сохранить",
    platform: "Платформа",
    delivery: "Доставка",
    popularItems: "Популярные товары",
    totalProducts: "Всего товаров",
    fastestDelivery: "Самая быстрая доставка",
    customerRating: "Рейтинг клиентов",
    categories: "Категории",
    productDetails: "Детали товара",
    description: "Описание",
    quantity: "Количество",
    continueShopping: "Продолжить покупки",
    placeOrder: "Оформить заказ",
    priceDetails: "Детали цены",
    deliveryCharges: "Стоимость доставки",
    free: "БЕСПЛАТНО",
    discount: "Скидка",
    totalAmount: "Общая сумма",
    enterCouponCode: "Введите код купона",
    apply: "Применить",
    availableCoupons: "Доступные купоны",
    safeSecurePayments: "Безопасные платежи",
    instantDigitalDelivery: "Мгновенная цифровая доставка",
    refundPolicy: "7-дневная политика возврата",
    manageTrackPurchases: "Управляйте и отслеживайте свои цифровые покупки",
    allOrders: "Все заказы",
    completed: "Завершено",
    pending: "В ожидании",
    processing: "Обработка",
    refunded: "Возвращено",
    order: "Заказ",
    orderDate: "Дата заказа",
    showCodes: "Показать коды",
    hideCodes: "Скрыть коды",
    downloadInvoice: "Скачать счет",
    yourRedeemCodes: "Ваши коды для активации",
    copy: "Копировать",
    noOrdersFound: "Заказы не найдены",
    noOrdersCategory: "Вы еще не разместили заказы в этой категории.",
    startShopping: "Начать покупки",
    instantDigitalGamingCodes: "Мгновенные цифровые игровые коды",
    getInstantAccess: "Получите мгновенный доступ к кодам Steam, PlayStation, Xbox и другим игровым кодам. Быстрая доставка, лучшие цены и 100% гарантированно рабочие коды.",
    shopNow: "Купить сейчас",
    howItWorks: "Как это работает",
    getCodesInSteps: "Получите свои коды в 3 простых шага",
    chooseYourCode: "Выберите свой код",
    selectFromVarious: "Выберите из различных игровых и развлекательных кодов",
    completePayment: "Завершите оплату",
    securePaymentOptions: "Безопасная оплата с несколькими доступными вариантами",
    receiveCodeInstantly: "Получите свой код мгновенно по электронной почте",
    mostPopularProducts: "Самые популярные товары",
    mostPopularGamingCodes: "Самые популярные игровые коды",
    happyCustomers: "Довольных клиентов",
    codesDelivered: "Кодов доставлено",
    successRate: "Процент успеха",
    customerSupport: "Поддержка клиентов"
  }
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 92.5 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 }
];

// Create the context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  // Fixed formatPrice function with proper error handling
  const formatPrice = (price) => {
    try {
      // Ensure price is a number
      let numPrice;
      
      if (typeof price === 'string') {
        // Remove any currency symbols, commas, and spaces
        const cleanPrice = price.replace(/[^0-9.-]+/g, '');
        numPrice = parseFloat(cleanPrice);
      } else if (typeof price === 'number') {
        numPrice = price;
      } else {
        numPrice = 0;
      }
      
      // Check if it's a valid number
      if (isNaN(numPrice)) {
        console.warn('Invalid price in formatPrice:', price);
        return `${currentCurrency.symbol}0.00`;
      }
      
      // Convert price based on currency rate
      const convertedPrice = numPrice * currentCurrency.rate;
      
      // Format with 2 decimal places
      return `${currentCurrency.symbol}${convertedPrice.toFixed(2)}`;
    } catch (error) {
      console.error('Error in formatPrice:', error);
      return `${currentCurrency.symbol}0.00`;
    }
  };

  const convertPrice = (price) => {
    try {
      const numPrice = Number(price);
      if (isNaN(numPrice)) {
        return 0;
      }
      return numPrice * currentCurrency.rate;
    } catch (error) {
      console.error('Error in convertPrice:', error);
      return 0;
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || translations.en[key] || key;
    
    // Replace placeholders like {count}, {name}, etc.
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(param => {
        if (translation.includes(`{${param}}`)) {
          translation = translation.replace(`{${param}}`, params[param]);
        }
      });
    }
    
    return translation;
  };

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  const changeCurrency = (currencyCode) => {
    setCurrency(currencyCode);
    localStorage.setItem('currency', currencyCode);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && languages.find(l => l.code === savedLang)) {
      setLanguage(savedLang);
    }
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency && currencies.find(c => c.code === savedCurrency)) {
      setCurrency(savedCurrency);
    }
  }, []);

  const value = {
    language,
    languages,
    currency,
    currencies,
    t,
    formatPrice,
    convertPrice,
    changeLanguage,
    changeCurrency,
    currentCurrency
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export the context as default
export default LanguageContext;