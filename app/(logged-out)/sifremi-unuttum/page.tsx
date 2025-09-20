"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function PageForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { loading, error, forgotPasswordSuccess, message } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (forgotPasswordSuccess) {
      // Başarılı şifre sıfırlama talebinden sonra şifre sıfırlama sayfasına yönlendir
      router.push(`/sifre-sifirla?email=${encodeURIComponent(email)}`);
    }
  }, [forgotPasswordSuccess, router, email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const validateForm = () => {
    let valid = true;
    
    if (!email) {
      setEmailError("E-posta adresi gereklidir");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Geçerli bir e-posta adresi giriniz");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await dispatch(forgotPassword({ email }));
      
      // Form başarıyla gönderildiyse hemen şifre sıfırlama sayfasına yönlendir
      router.push(`/sifre-sifirla?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <>
      {/* Şifremi Unuttum Bölümü */}
      <section className="position-relative border-bottom">
        <div className="container">
          <div className="row pt-7 pb-50 justify-content-center">
            <div className="col-lg-5 text-center">
              <h3>Şifremi Unuttum</h3>
              <p className="text-500">
                E-posta adresinizi girin, şifre sıfırlama bağlantısını göndereceğiz
              </p>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {forgotPasswordSuccess && message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
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
                      className={`form-control ms-0 border rounded-3 rounded-start-0 border-start-0 ${emailError ? 'is-invalid' : ''}`}
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="E-posta adresiniz"
                      id="email"
                      aria-label="email"
                    />
                  </div>
                  {emailError && <div className="text-danger small">{emailError}</div>}
                </div>
                <div className="col-12 mt-5">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
                  </button>
                </div>
              </form>
              <p className="text-500 fs-7 mt-5">
                <Link
                  href="/giris"
                  className="text-900 text-decoration-underline fs-7"
                >
                  Giriş sayfasına dön
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 