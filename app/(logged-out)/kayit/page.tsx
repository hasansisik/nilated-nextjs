"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function PageRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { loading, error, registerSuccess, message } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (registerSuccess) {
      // Başarılı kayıttan sonra e-posta doğrulama sayfasına yönlendir
      router.push(`/mail-dogrulama?email=${encodeURIComponent(formData.email)}`);
    }
  }, [registerSuccess, router, formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Reset error when user types
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let valid = true;
    const errors = { name: "", email: "", password: "", acceptTerms: "" };

    if (!formData.name) {
      errors.name = "Kullanıcı adı gereklidir";
      valid = false;
    }

    if (!formData.email) {
      errors.email = "E-posta adresi gereklidir";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Geçerli bir e-posta adresi giriniz";
      valid = false;
    }

    if (!formData.password) {
      errors.password = "Şifre gereklidir";
      valid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Şifre en az 8 karakter olmalıdır";
      valid = false;
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = "Şartlar ve koşulları kabul etmelisiniz";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Kayıt işlemi öncesinde doğrudan mail doğrulama sayfasına yönlendir
      router.push(`/mail-dogrulama?email=${encodeURIComponent(formData.email)}`);
      
      // Arka planda kayıt işlemini başlat
      const { acceptTerms, ...userData } = formData;
      dispatch(registerUser(userData));
    }
  };

  return (
    <>
      {/* Kayıt Bölümü */}
      <section className="position-relative border-bottom">
        <div className="container">
          <div className="row pt-7 pb-120 justify-content-center">
            <div className="col-lg-5 text-center">
              <h3>Hesap Oluştur</h3>
              <p className="text-500">
                Bugün bir hesap oluşturun ve platformumuzu kullanmaya başlayın
              </p>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {registerSuccess && message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="col text-start">
                  <label htmlFor="name" className="form-label mt-2 text-900">
                    Kullanıcı Adı *
                  </label>
                  <div className="input-group d-flex align-items-center">
                    <div className="icon-input border border-end-0 rounded-3 rounded-end-0 ps-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          className="stroke-dark"
                          d="M12 11.25C13.7949 11.25 15.25 9.79493 15.25 8C15.25 6.20507 13.7949 4.75 12 4.75C10.2051 4.75 8.75 6.20507 8.75 8C8.75 9.79493 10.2051 11.25 12 11.25Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          className="stroke-dark"
                          d="M6.84723 19.25H17.1522C18.2941 19.25 19.1737 18.2681 18.6405 17.2584C17.856 15.7731 16.0677 14 11.9997 14C7.93174 14 6.1434 15.7731 5.35897 17.2584C4.8257 18.2681 5.70531 19.25 6.84723 19.25Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className={`form-control ms-0 border rounded-3 rounded-start-0 border-start-0 ${formErrors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Kullanıcı adınızı girin"
                      id="name"
                      aria-label="username"
                    />
                  </div>
                  {formErrors.name && <div className="text-danger small">{formErrors.name}</div>}
                </div>
                <div className="col text-start">
                  <label
                    htmlFor="email"
                    className="form-label mt-2 text-900"
                  >
                    E-posta *
                  </label>
                  <div className="input-group d-flex align-items-center">
                    <div className="icon-input border border-end-0 rounded-3 rounded-end-0 ps-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          className="stroke-dark"
                          d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          className="stroke-dark"
                          d="M5.5 6.5L12 12.25L18.5 6.5"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      className={`form-control ms-0 border rounded-3 rounded-start-0 border-start-0 ${formErrors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-posta adresiniz"
                      id="email"
                      aria-label="email"
                    />
                  </div>
                  {formErrors.email && <div className="text-danger small">{formErrors.email}</div>}
                </div>
                <div className="col text-start">
                  <label htmlFor="password" className="form-label mt-2 text-900">
                    Şifre *
                  </label>
                  <div className="input-group d-flex align-items-center">
                    <div className="icon-input border border-end-0 rounded-3 rounded-end-0 ps-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          className="stroke-dark"
                          d="M4.75 5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H9.25C9.80228 4.75 10.25 5.19772 10.25 5.75V9.25C10.25 9.80228 9.80228 10.25 9.25 10.25H5.75C5.19772 10.25 4.75 9.80228 4.75 9.25V5.75Z"
                          stroke="#111827"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          className="stroke-dark"
                          d="M4.75 14.75C4.75 14.1977 5.19772 13.75 5.75 13.75H9.25C9.80228 13.75 10.25 14.1977 10.25 14.75V18.25C10.25 18.8023 9.80228 19.25 9.25 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V14.75Z"
                          stroke="#111827"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          className="stroke-dark"
                          d="M13.75 5.75C13.75 5.19772 14.1977 4.75 14.75 4.75H18.25C18.8023 4.75 19.25 5.19772 19.25 5.75V9.25C19.25 9.80228 18.8023 10.25 18.25 10.25H14.75C14.1977 10.25 13.75 9.80228 13.75 9.25V5.75Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          className="stroke-dark"
                          d="M13.75 14.75C13.75 14.1977 14.1977 13.75 14.75 13.75H18.25C18.8023 13.75 19.25 14.1977 19.25 14.75V18.25C19.25 18.8023 18.8023 19.25 18.25 19.25H14.75C14.1977 19.25 13.75 18.8023 13.75 18.25V14.75Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      className={`form-control ms-0 border rounded-3 rounded-start-0 border-start-0 ${formErrors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="en az 8 karakter"
                      id="password"
                      aria-label="password"
                    />
                  </div>
                  {formErrors.password && <div className="text-danger small">{formErrors.password}</div>}
                </div>
                <div className="col-12 mt-2">
                  <div className="form-check text-start">
                    <input
                      className={`form-check-input ${formErrors.acceptTerms ? 'is-invalid' : ''}`}
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label text-500 fs-7"
                      htmlFor="acceptTerms"
                    >
                      {" "}
                      Şartlar ve koşulları kabul ediyorum{" "}
                    </label>
                    {formErrors.acceptTerms && <div className="text-danger small">{formErrors.acceptTerms}</div>}
                  </div>
                </div>
                <div className="col-12 mt-5">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Hesap Oluşturuluyor..." : "Yeni hesap oluştur"}
                  </button>
                </div>
              </form>
              <p className="text-500 fs-7 mt-5">
                Zaten bir hesabınız var mı?{" "}
                <Link
                  href="/giris"
                  className="text-900 text-decoration-underline fs-7"
                >
                  Buradan Giriş Yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
