import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import "./Profile.css";

export default function Profile() {
  const { t } = useLanguage();
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  // Initial state structure matching the form fields
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchOrdersCount();
    }
  }, [user]);

  const fetchOrdersCount = async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!error) {
        setOrdersCount(count || 0);
      }
    } catch (error) {
      console.error("Error fetching orders count:", error);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      setLoading(true);
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: formData.full_name,
            phone: formData.phone,
            address: formData.address,
            updated_at: new Date(),
          })

        if (error) throw error;

        await refreshProfile();
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          avatar_url: publicUrl,
          updated_at: new Date()
        })

      if (updateError) {
        throw updateError;
      }

      await refreshProfile();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar. Make sure the 'avatars' bucket exists and is public.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center text-white">Please log in to view your profile.</div>;
  }

  // Helper date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
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
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjQzRDNEM0Ii8+CjxwYXRoIGQ9Ik0gNzUgOTAgQyA4NSA5MCA5NSA4MCA5NSA3MCBMIDk1IDExMCBDIDk1IDEyMCA4NSAxMzAgNzUgMTMwIEMgNjUgMTMwIDU1IDEyMCA1NSAxMTAgTCA1NSAxMTAgTCA1NSA3MCBDIDU1IDgwIDY1IDkwIDc1IDkwIFoiIGZpbGw9IiNDNEM0QzQiLz4KPC9zdmc+";
                  }}
                />
              ) : (
                <div className="default-avatar">
                  <span className="avatar-text">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </div>
              )}

              <div className="image-upload-overlay">
                <label htmlFor="profile-upload" className="upload-label" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
                  {uploading ? '⏳ Uploading...' : `📷 ${t("changePhoto")}`}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </div>

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
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="edit-input disabled"
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
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
                    placeholder="+1 234 567 8900"
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
                    placeholder="Enter your shipping address"
                  />
                </div>
              </div>
            ) : (
              <div className="info-display">
                <div className="info-item">
                  <span className="info-label">{t("name")}:</span>
                  <span className="info-value">{profile?.full_name || "Not set"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{profile?.phone || "Not set"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{profile?.address || "Not set"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t("memberSince")}:</span>
                  <span className="info-value">{formatDate(user.created_at)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t("totalOrders")}:</span>
                  <span className="info-value highlight">{ordersCount}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="profile-actions">
              <button
                className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleEditToggle}
                disabled={loading}
              >
                {loading ? "Saving..." : (isEditing ? t("save") : t("editProfile"))}
              </button>
              {isEditing && (
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setFormData({
                      full_name: profile?.full_name || "",
                      phone: profile?.phone || "",
                      address: profile?.address || "",
                    });
                    setIsEditing(false);
                  }}
                  disabled={loading}
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