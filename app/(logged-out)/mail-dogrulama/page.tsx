"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, resendVerificationCode } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function PageEmailVerification() {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [codeError, setCodeError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error, verificationSuccess, message } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (verificationSuccess) {
      // Başarılı doğrulamadan sonra giriş sayfasına yönlendir
      setTimeout(() => {
        router.push("/giris");
      }, 3000);
    }
  }, [verificationSuccess, router]);

  // Geri sayım işlevi
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      setCodeError("");

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
    
    // Tüm alanlar dolu mu kontrol et
    if (verificationCode.some(digit => !digit)) {
      setCodeError("Lütfen 4 haneli doğrulama kodunu eksiksiz giriniz");
      valid = false;
    }
    
    if (!email) {
      setCodeError("E-posta adresi bulunamadı");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const code = verificationCode.join("");
      dispatch(verifyEmail({
        email,
        verificationCode: code
      }));
    }
  };

  const handleResendCode = async () => {
    if (email && resendCooldown === 0) {
      dispatch(resendVerificationCode(email));
      setResendCooldown(60); // 60 saniye bekleme süresi
    }
  };

  return (
    <>
      {/* Email Doğrulama Bölümü */}
      <section className="position-relative border-bottom">
        <div className="container">
          <div className="row pt-7 pb-50 justify-content-center">
            <div className="col-lg-5 text-center">
              <h3>E-posta Doğrulama</h3>
              {email && (
                <div className="alert alert-info" role="alert">
                  <strong>{email}</strong> adresine gönderilen 4 haneli doğrulama kodunu giriniz
                </div>
              )}
              {!email && (
                <p className="text-500">
                  E-posta adresinize gönderilen 4 haneli doğrulama kodunu giriniz
                </p>
              )}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {verificationSuccess && message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="verification-code d-flex justify-content-center gap-2 my-4">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      className="form-control text-center"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleInputChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ))}
                </div>
                {codeError && <div className="text-danger small mb-3">{codeError}</div>}
                <p className="text-500 fs-7 mb-4">
                  Doğrulama kodunu almadınız mı?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-muted">Tekrar gönder ({resendCooldown}s)</span>
                  ) : (
                    <Link 
                      href="#" 
                      className="text-900 text-decoration-underline fs-7"
                      onClick={(e) => {
                        e.preventDefault();
                        handleResendCode();
                      }}
                    >
                      Tekrar Gönder
                    </Link>
                  )}
                </p>
                <div className="col-12 mt-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Doğrulanıyor..." : "Doğrula"}
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