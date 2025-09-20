"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function PageLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

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
    // Clear Redux error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    let valid = true;
    const errors = { email: "", password: "" };

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
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await dispatch(login(formData));
    }
  };

  return (
    <>
      {/* Giriş Bölümü */}
      <section className="position-relative border-bottom">
        <div className="container">
          <div className="row pt-7 pb-50 justify-content-center">
            <div className="col-lg-5 text-center">
              <h3>Tekrar Hoşgeldiniz!</h3>
              <p className="text-500">
                Hesabınıza giriş yapın ve platformumuzu kullanmaya başlayın
              </p>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error === 'Unauthorized' || error === 'Invalid credentials' ? 
                    'E-posta adresiniz veya şifreniz hatalı. Lütfen tekrar deneyin.' : 
                    error
                  }
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="col text-start">
                  <label htmlFor="email" className="form-label mt-2 text-900">
                    Kullanıcı Adı veya E-posta *
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
                      className={`form-control ms-0 border rounded-3 rounded-start-0 border-start-0 ${formErrors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-posta adresinizi girin"
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
                <div className="col-12 mt-2 d-flex justify-content-between">
                  <Link href="/sifremi-unuttum" className="text-500 fs-7">
                    Şifremi unuttum?
                  </Link>
                </div>
                <div className="col-12 mt-5">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100" 
                    disabled={loading}
                  >
                    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  </button>
                </div>
              </form>
              <p className="text-500 fs-7 mt-5">
                Hesabınız yok mu?{" "}
                <Link
                  href="/kayit"
                  className="text-900 text-decoration-underline fs-7"
                >
                  Buradan Kaydolun
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
