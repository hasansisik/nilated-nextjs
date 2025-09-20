'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "@/redux/actions/userActions";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function ProfileLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı profilini getir
    dispatch(getMyProfile());
  }, [dispatch]);

  // Kimlik doğrulama durumunu kontrol et ve giriş yapmamış kullanıcıları yönlendir
  useEffect(() => {
    // Yükleme tamamlandıktan sonra ve kullanıcı kimliği doğrulanmamışsa
    if (!loading && !isAuthenticated && !user?.name) {
      // Local storage'da token var mı kontrol et
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push('/giris');
      }
    }
  }, [isAuthenticated, loading, user, router]);

  // Sadece ilk yükleme sırasında spinner göster
  if (loading && !user?.name) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="alert alert-danger" role="alert">
          Bir hata oluştu: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
} 