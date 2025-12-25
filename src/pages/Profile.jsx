import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Profile.css";

export default function Profile() {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Krishna kumar",
    email: "krish@gmail.com",
    phone: "+91 1234567890",
    address: "123 Main Street,kpc,madurai-14",
    joinDate: "January 2025",
    orders: 15,
    profileImage: null // Start with null for better UX
  });

  const [formData, setFormData] = useState({ ...user });

  const handleEditToggle = () => {
    if (isEditing) {
      setUser(formData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          profileImage: event.target.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>{t("myProfile")}</h2>
          <p>{t("manageTrackPurchases")}</p>
        </div>

        <div className="profile-content">
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="image-container">
              {(isEditing ? formData.profileImage : user.profileImage) ? (
                <img
                  src={isEditing ? formData.profileImage : user.profileImage}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjQzRDNEM0Ii8+CjxwYXRoIGQ9Ik0gNzUgOTAgQyA4NSA5MCA5NSA4MCA5NSA3MCBMIDk1IDExMCBDIDk1IDEyMCA4NSAxMzAgNzUgMTMwIEMgNjUgMTMwIDU1IDEyMCA1NSAxMTAgTCA1NSAxMTAgTCA1NSA3MCBDIDU1IDgwIDY1IDkwIDc1IDkwIFoiIGZpbGw9IiNDNEM0QzQiLz4KPC9zdmc+";
                  }}
                />
              ) : (
                <div className="default-avatar">
                  <span className="avatar-text">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
              {isEditing && (
                <div className="image-upload-overlay">
                  <label htmlFor="profile-upload" className="upload-label">
                    📷 {t("changePhoto")}
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="input-group">
                  <label>{t("name")}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                </div>

                <div className="input-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                </div>

                <div className="input-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="edit-textarea"
                    rows="3"
                  />
                </div>
              </div>
            ) : (
              <div className="info-display">
                <div className="info-item">
                  <span className="info-label">{t("name")}:</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{user.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{user.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t("memberSince")}:</span>
                  <span className="info-value">{user.joinDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t("totalOrders")}:</span>
                  <span className="info-value highlight">{user.orders}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="profile-actions">
              <button
                className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleEditToggle}
              >
                {isEditing ? t("save") : t("editProfile")}
              </button>
              {isEditing && (
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setFormData({ ...user });
                    setIsEditing(false);
                  }}
                >
                  {t("cancel")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}