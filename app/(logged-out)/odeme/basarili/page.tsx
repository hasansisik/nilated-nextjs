"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Gift, Star, Award, Zap, ArrowLeft, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

// Import required for confetti effect
const importConfetti = () => import('canvas-confetti');

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user, loading } = useSelector((state: RootState) => state.user);
  const [isValidPayment, setIsValidPayment] = useState(false);
  
  // Get user profile
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  // Check payment validation but don't show error UI
  useEffect(() => {
    try {
      // Check if payment was successful from the payment page
      const paymentSuccessful = sessionStorage.getItem('paymentSuccessful');
      
      // If valid token, show success message
      if (paymentSuccessful === 'true') {
        setIsValidPayment(true);
        
        // Clear token from session storage to prevent reuse
        sessionStorage.removeItem('paymentSuccessful');
      } else {
        setIsValidPayment(false);
      }
      
      // Always trigger confetti regardless of validation
      triggerConfetti();
    } catch (error) {
      console.error("Error checking payment validation:", error);
      // Default to false for security
      setIsValidPayment(false);
    }
  }, []);

  // Trigger confetti animation
  const triggerConfetti = async () => {
    try {
      const confetti = (await importConfetti()).default;
      
      // Initial big burst
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Set repeated confetti bursts from sides
      setShowConfetti(true);
      
      // Side confetti bursts every 2.5 seconds
      const confettiInterval = setInterval(async () => {
        const confetti = (await importConfetti()).default;
        
        // Left side
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        
        // Right side
        setTimeout(async () => {
          const confetti = (await importConfetti()).default;
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 250);
      }, 2500);

      // Stop confetti after 10 seconds
      setTimeout(() => {
        clearInterval(confettiInterval);
        setShowConfetti(false);
      }, 10000);

      return () => clearInterval(confettiInterval);
    } catch (error) {
      console.error("Error triggering confetti:", error);
    }
  };

  // Countdown and redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col px-4">
      {/* Header with back button */}
      
      {/* Success animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-float absolute top-20 left-1/4 text-green-300 opacity-50">
          <Gift size={32} />
        </div>
        <div className="animate-float-delayed absolute top-40 right-1/4 text-yellow-300 opacity-50">
          <Star size={40} />
        </div>
        <div className="animate-float-slow absolute bottom-40 left-1/3 text-orange-300 opacity-50">
          <Award size={48} />
        </div>
        <div className="animate-float-slower absolute bottom-20 right-1/3 text-blue-300 opacity-50">
          <Zap size={36} />
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-5">
        <Card className="shadow-xl border-green-200 max-w-md w-full transform transition-all duration-500 hover:scale-105">
          <CardHeader className="pb-2 text-center relative">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg animate-pulse">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="mt-14">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 text-transparent bg-clip-text">Ödeme Başarılı!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="py-4 px-2">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Premium içerik erişiminiz <span className="font-semibold text-green-600">başarıyla aktifleştirildi</span>. 
                Tüm premium içeriklere artık sınırsız erişebilirsiniz.
              </p>
              
              <div className="p-2 bg-gray-50 rounded-lg mb-6">
                <h4 className="font-medium text-sm mb-2">Premium Abonelik Detayları:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Tüm özel makalelere sınırsız erişim</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Premium içerik koleksiyonlarına tam erişim</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="countdown-text font-medium text-green-600">{countdown}</span> saniye içinde otomatik olarak ana sayfaya yönlendirileceksiniz.
                </p>
              </div>
              
              <Button 
                onClick={() => router.push("/")}
                className="w-full rounded bg-orange-500 text-white "
              >
                Hemen Ana Sayfaya Dön
              </Button>
              
              {/* Payment status indicator */}
              {!isValidPayment && (
                <div className="mt-4 text-xs p-2 bg-amber-50 rounded-md border border-amber-100">
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <p>Ödeme sayfasından gelmeyen ziyaretler için premium özellikler etkinleştirilmez.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add floating animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out 1s infinite;
        }
        .animate-float-slow {
          animation: float 7s ease-in-out 0.5s infinite;
        }
        .animate-float-slower {
          animation: float 8s ease-in-out 1.5s infinite;
        }
        .countdown-text {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
} 