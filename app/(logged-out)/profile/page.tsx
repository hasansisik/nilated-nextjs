"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, editProfile, logout } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { user, loading, error, success, message } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.name) {
      setFormData({
        ...formData,
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (success && message) {
      setSuccessMessage(message);
      
      // Reset password fields after successful password change
      if (activeTab === 'password') {
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [success, message]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Reset error when user types
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateProfileForm = () => {
    let valid = true;
    const errors = { ...formErrors };

    if (!formData.name) {
      errors.name = "İsim gereklidir";
      valid = false;
    }

    if (!formData.email) {
      errors.email = "E-posta adresi gereklidir";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Geçerli bir e-posta adresi giriniz";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const validatePasswordForm = () => {
    let valid = true;
    const errors = { ...formErrors };

    if (!formData.currentPassword) {
      errors.currentPassword = "Mevcut şifre gereklidir";
      valid = false;
    }

    if (!formData.newPassword) {
      errors.newPassword = "Yeni şifre gereklidir";
      valid = false;
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = "Şifre en az 8 karakter olmalıdır";
      valid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Şifre onayı gereklidir";
      valid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Şifreler eşleşmiyor";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (validateProfileForm()) {
      await dispatch(editProfile({
        name: formData.name,
        email: formData.email
      }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (validatePasswordForm()) {
      await dispatch(editProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());    
    router.push('/');

  };

  if (loading && !user.name) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
        </div>
      )}
      
      <div className="row">
        <div className="col-lg-3">
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body text-center">
              <h6 className="mb-2 fw-bold">{user.name}</h6>
              <p className="text-muted mb-2 small">{user.email}</p>
              <div className="d-flex justify-content-center mb-3">
                <span className={`badge ${user.isPremium ? 'bg-warning' : 'bg-secondary'} px-2 py-1 small`}>
                  {user.isPremium ? 'Premium Üye' : 'Standart Üye'}
                </span>
              </div>
              <div className="d-grid">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-danger btn-sm"
                  type="button"
                  style={{
                    width: "100%",
                    height: "40px",
                    fontSize: "14px",
                    padding: "0.375rem 0.75rem"
                  }}
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-white py-2">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''} small`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profil Bilgileri
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'password' ? 'active' : ''} small`}
                    onClick={() => setActiveTab('password')}
                    
                  >
                    Şifre Değiştir
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0 small">Ad Soyad</h6>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className={`form-control form-control-sm ${formErrors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {formErrors.name && <div className="invalid-feedback small">{formErrors.name}</div>}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0 small">E-posta</h6>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="email"
                        className={`form-control form-control-sm ${formErrors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {formErrors.email && <div className="invalid-feedback small">{formErrors.email}</div>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-9">
                      <button 
                        type="submit" 
                        className="btn btn-sm btn-primary px-3"
                        disabled={loading}
                        style={{
                          height: "50px",
                          fontSize: "14px",
                          padding: "0.375rem 0.75rem"
                        }}
                      >
                        {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
              
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0 small">Mevcut Şifre</h6>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className={`form-control form-control-sm ${formErrors.currentPassword ? 'is-invalid' : ''}`}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                      {formErrors.currentPassword && <div className="invalid-feedback small">{formErrors.currentPassword}</div>}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0 small">Yeni Şifre</h6>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className={`form-control form-control-sm ${formErrors.newPassword ? 'is-invalid' : ''}`}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                      {formErrors.newPassword && <div className="invalid-feedback small">{formErrors.newPassword}</div>}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0 small">Şifre Tekrar</h6>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className={`form-control form-control-sm ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      {formErrors.confirmPassword && <div className="invalid-feedback small">{formErrors.confirmPassword}</div>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-9">
                      <button 
                        type="submit" 
                        className="btn btn-sm btn-primary px-3"
                        disabled={loading}
                        style={{
                          height: "50px",
                          fontSize: "14px",
                          padding: "0.375rem 0.75rem"
                        }}
                      >
                        {loading ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 