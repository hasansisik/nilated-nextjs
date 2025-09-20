"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function PageResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  
  const { loading, error, resetPasswordSuccess, message } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (resetPasswordSuccess) {
      // Başarılı şifre sıfırlamadan sonra giriş sayfasına yönlendir
      setTimeout(() => {
        router.push("/giris");
      }, 3000);
    }
  }, [resetPasswordSuccess, router]);

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
  
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      setFormErrors({
        ...formErrors,
        verificationCode: "",
      });

      // Otomatik olarak bir sonraki input alanına geç
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace tuşu ile önceki alana geç
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Sadece sayılardan oluşuyorsa ve 4 hane ise
    if (/^\d{4}$/.test(pastedData)) {
      const newCode = pastedData.split("").map(char => char);
      setVerificationCode(newCode);
      
      // Son inputa odaklan
      inputRefs.current[3]?.focus();
    }
  };

  const validateForm = () => {
    let valid = true;
    const errors = { 
      password: "", 
      confirmPassword: "",
      verificationCode: "" 
    };

    if (!formData.password) {
      errors.password = "Şifre gereklidir";
      valid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Şifre en az 8 karakter olmalıdır";
      valid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Şifre onayı gereklidir";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Şifreler eşleşmiyor";
      valid = false;
    }
    
    // Doğrulama kodu kontrolü
    if (verificationCode.some(digit => !digit)) {
      errors.verificationCode = "Doğrulama kodu gereklidir";
      valid = false;
    }

    if (!email) {
      valid = false;
      alert("E-posta adresi bulunamadı. Lütfen tekrar deneyiniz.");
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const code = verificationCode.join("");
      await dispatch(resetPassword({
        token: code, // Doğrulama kodunu token olarak kullan
        email,
        password: formData.password
      }));
    }
  };

  return (
    <>
      {/* Şifre Sıfırlama Bölümü */}
      <section className="position-relative border-bottom">
        <div className="container">
          <div className="row pt-7 pb-50 justify-content-center">
            <div className="col-lg-5 text-center">
              <h3>Şifre Sıfırlama</h3>
              
              {email && (
                <div className="alert alert-info" role="alert">
                  <strong>{email}</strong> adresine gönderilen 4 haneli doğrulama kodunu giriniz
                </div>
              )}
              
              {!email && (
                <p className="text-500">
                  Yeni şifrenizi belirleyin ve hesabınıza erişime devam edin
                </p>
              )}
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {resetPasswordSuccess && message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {/* Doğrulama Kodu Alanı */}
                <div className="mb-4">
                  <label className="form-label text-900">Doğrulama Kodu *</label>
                  <div className="verification-code d-flex justify-content-center gap-2 my-2">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        className="form-control text-center"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleCodeChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        style={{ width: "50px", height: "50px" }}
                      />
                    ))}
                  </div>
                  {formErrors.verificationCode && (
                    <div className="text-danger small">{formErrors.verificationCode}</div>
                  )}
                </div>
                
                <div className="col text-start">
                  <label htmlFor="password" className="form-label mt-2 text-900">
                    Yeni Şifre *
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
                <div className="col text-start">
                  <label htmlFor="confirmPassword" className="form-label mt-2 text-900">
                    Şifrenizi Onaylayın *
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
                      className={`form-control ms-0 border rounded-3 rounded-start-0 border-start-0 ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="şifrenizi tekrar girin"
                      id="confirmPassword"
                      aria-label="confirm-password"
                    />
                  </div>
                  {formErrors.confirmPassword && <div className="text-danger small">{formErrors.confirmPassword}</div>}
                </div>
                <div className="col-12 mt-5">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "İşleniyor..." : "Şifremi Sıfırla"}
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