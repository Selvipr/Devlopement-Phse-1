import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Orders.css";

export default function Orders() {
  const { t, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");

  const orders = [
    {
      id: "ORD-7842",
      date: "2024-12-15",
      items: [
        { name: "Steam Wallet Code - $50", quantity: 1, price: "$45.00" },
        { name: "Spotify Premium - 1 Month", quantity: 1, price: "$9.99" }
      ],
      total: "$54.99",
      status: "completed",
      delivery: "Instant",
      codes: ["STEAM-7842-XYZA-1234", "SPOTIFY-5678-BCDE-9012"]
    },
    {
      id: "ORD-7831",
      date: "2024-12-12",
      items: [
        { name: "PlayStation Network - $25", quantity: 2, price: "$47.50" }
      ],
      total: "$47.50",
      status: "completed",
      delivery: "Instant",
      codes: ["PSN-7831-ABCD-EFGH", "PSN-7831-IJKL-MNOP"]
    },
    {
      id: "ORD-7815",
      date: "2024-12-10",
      items: [
        { name: "Xbox Live Gold - 3 Months", quantity: 1, price: "$24.99" },
        { name: "Google Play Gift Card - $20", quantity: 1, price: "$18.00" }
      ],
      total: "$42.99",
      status: "completed",
      delivery: "Instant",
      codes: ["XBOX-7815-QWER-1234", "GOOGLE-7815-5678-90AB"]
    },
    {
      id: "ORD-7798",
      date: "2024-12-08",
      items: [
        { name: "Netflix Gift Card - $30", quantity: 1, price: "$27.00" }
      ],
      total: "$27.00",
      status: "refunded",
      delivery: "Instant",
      codes: []
    }
  ];

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#10b981";
      case "pending": return "#f59e0b";
      case "processing": return "#3b82f6";
      case "refunded": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const OrderCard = ({ order }) => {
    const [showCodes, setShowCodes] = useState(false);

    return (
      <div className="order-card">
        <div className="order-header">
          <div className="order-info">
            <h3>Order #{order.id}</h3>
            <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
          </div>
          <div className="order-status">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {t(order.status)}
            </span>
          </div>
        </div>

        <div className="order-items">
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">Qty: {item.quantity}</span>
              <span className="item-price">{item.price}</span>
            </div>
          ))}
        </div>

        <div className="order-footer">
          <div className="order-total">
            <strong>Total: {order.total}</strong>
          </div>
          <div className="order-actions">
            {order.status === "completed" && (
              <button 
                className="btn btn-outline btn-small"
                onClick={() => setShowCodes(!showCodes)}
              >
                {showCodes ? t("hideCodes") : t("showCodes")}
              </button>
            )}
            <button className="btn btn-primary btn-small">
              {t("downloadInvoice")}
            </button>
          </div>
        </div>

        {showCodes && order.codes.length > 0 && (
          <div className="codes-section">
            <h4>{t("yourRedeemCodes")}:</h4>
            {order.codes.map((code, index) => (
              <div key={index} className="code-item">
                <code>{code}</code>
                <button 
                  className="btn-copy"
                  onClick={() => navigator.clipboard.writeText(code)}
                >
                  {t("copy")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>{t("myOrders")}</h1>
        <p>{t("manageTrackPurchases")}</p>
      </div>

      <div className="orders-tabs">
        <button 
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          {t("allOrders")}
        </button>
        <button 
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          {t("completed")}
        </button>
        <button 
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          {t("pending")}
        </button>
      </div>

      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>{t("noOrdersFound")}</h3>
            <p>{t("noOrdersCategory")}</p>
            <button className="btn btn-primary">{t("startShopping")}</button>
          </div>
        )}
      </div>
    </div>
  );
}