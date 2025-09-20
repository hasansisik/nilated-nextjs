"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setPremiumStatus, getMyProfile } from "@/redux/actions/userActions";
import { getGeneral } from "@/redux/actions/generalActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function IyzicoCheckout() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: userLoading } = useSelector((state: RootState) => state.user);
  const { general, loading: generalLoading } = useSelector((state: RootState) => state.general);
  const [error, setError] = useState<string | null>(null);
  const [premiumUpdated, setPremiumUpdated] = useState(false);
  
  // Card details state
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for input fields
  const cardHolderRef = useRef<HTMLInputElement>(null);
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const expiryMonthRef = useRef<HTMLInputElement>(null);
  const expiryYearRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  // Load user profile and general settings on mount
  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getGeneral());
  }, [dispatch]);

  // Premium configuration with proper fallbacks
  const premiumConfig = {
    price: general?.premium?.price || 3600,
    currency: general?.premium?.currency || "TL",
    features: general?.premium?.features || [
      "Her ay kapsamını genişlettiğimiz eğitim içeriklerine",
      "Türkiye'nin en büyük yaratıcı topluluğuna erişime",
      "Katma Değer Fonu'na başvurma hakkına"
    ],
    ctaText: general?.premium?.ctaText || "HEMEN KATILIN",
    yearlyPriceText: general?.premium?.yearlyPriceText || "Üyelik ücreti yıllık 3.600 TL olarak belirlenmiştir.",
    description: general?.premium?.description || "Komünite, sunduğu eğitimler, birlikte çalıştığı uzmanlar, sunduğu topluluk öğrenimi fırsatı, üyelerine sağladığı her türlü içerik ve indirimlerden dolayı sadece yıllık olarak ücretlendirilmektedir."
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Handle card holder change
  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardHolder(e.target.value);
  };

  // Handle card number change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
    
    // Auto-focus to next field when card number is complete
    if (formattedValue.replace(/\s/g, "").length === 16 && expiryMonthRef.current) {
      expiryMonthRef.current.focus();
    }
  };

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    
    // Validate month
    if (value && parseInt(value) > 12) {
      setExpiryMonth("12");
      if (expiryYearRef.current) {
        expiryYearRef.current.focus();
      }
    } else {
      setExpiryMonth(value);
      // Auto-focus to year field when month is complete
      if (value.length === 2 && expiryYearRef.current) {
        expiryYearRef.current.focus();
      }
    }
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setExpiryYear(value);
    
    // Auto-focus to CVV field when year is complete
    if (value.length === 2 && cvvRef.current) {
      cvvRef.current.focus();
    }
  };

  // Handle CVV change
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  // Update premium status
  const updatePremiumStatus = async () => {
    if (!premiumUpdated && !userLoading && user?._id) {
      try {
        await dispatch(setPremiumStatus(true));
        setPremiumUpdated(true);
        return true;
      } catch (error) {
        console.error("Error updating premium status:", error);
        return false;
      }
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validation
      if (!cardHolder.trim()) {
        setError("Kart üzerindeki isim boş bırakılamaz");
        setIsSubmitting(false);
        if (cardHolderRef.current) cardHolderRef.current.focus();
        return;
      }
      
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setError("Geçerli bir kart numarası giriniz");
        setIsSubmitting(false);
        if (cardNumberRef.current) cardNumberRef.current.focus();
        return;
      }
      
      if (!expiryMonth || !expiryYear) {
        setError("Geçerli bir son kullanma tarihi giriniz");
        setIsSubmitting(false);
        if (!expiryMonth && expiryMonthRef.current) expiryMonthRef.current.focus();
        else if (!expiryYear && expiryYearRef.current) expiryYearRef.current.focus();
        return;
      }
      
      // Validate month
      const month = parseInt(expiryMonth);
      if (month < 1 || month > 12) {
        setError("Geçerli bir ay giriniz (1-12)");
        setIsSubmitting(false);
        if (expiryMonthRef.current) expiryMonthRef.current.focus();
        return;
      }
      
      if (cvv.length < 3) {
        setError("Geçerli bir CVV kodu giriniz");
        setIsSubmitting(false);
        if (cvvRef.current) cvvRef.current.focus();
        return;
      }
      
      // In a real implementation, you would send the card data to your payment API
      // For this demo, we'll simulate a successful payment
      
      // First update premium status
      await updatePremiumStatus();
      
      // Set a flag to indicate payment was successful
      try {
        sessionStorage.setItem('paymentSuccessful', 'true');
      } catch (err) {
        console.error("Error setting sessionStorage:", err);
      }
      
      // Then redirect to success page after a small delay
      setTimeout(() => {
        router.push("/odeme/basarili");
      }, 2000);
      
    } catch (error) {
      console.error("Payment error:", error);
      setError("Ödeme işlemi sırasında bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while general settings are loading
  if (generalLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="mr-1 h-3 w-3" />
        Ana Sayfaya Dön
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-1">Premium İçerik Erişimi</h4>
            <p className="text-gray-600 text-sm">
              Tek seferlik ödeme ile tüm premium içeriklere erişin
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <Card className="shadow-sm mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ödeme</CardTitle>
              <CardDescription className="text-xs">
                Güvenli ödeme işlemi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Payment form title */}
              <div className="flex mb-6 border-b pb-3">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                  <h3 className="text-lg font-medium">Kartla Ödeme</h3>
                </div>
              </div>
              
              {/* Card payment form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardHolder" className="text-sm font-medium">
                      Kart Üzerindeki Ad Soyad
                    </Label>
                    <Input
                      id="cardHolder"
                      ref={cardHolderRef}
                      value={cardHolder}
                      onChange={handleCardHolderChange}
                      onKeyDown={(e) => e.key === "Enter" && cardNumberRef.current?.focus()}
                      placeholder="Kart Üzerindeki Ad Soyad"
                      className="mt-1 text-gray-800"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm font-medium">
                      Kart Numarası
                    </Label>
                    <Input
                      id="cardNumber"
                      ref={cardNumberRef}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onKeyDown={(e) => e.key === "Enter" && expiryMonthRef.current?.focus()}
                      placeholder="0000 0000 0000 0000"
                      className="mt-1 text-gray-800"
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth" className="text-sm font-medium">
                        Ay
                      </Label>
                      <Input
                        id="expiryMonth"
                        ref={expiryMonthRef}
                        value={expiryMonth}
                        onChange={handleMonthChange}
                        onKeyDown={(e) => e.key === "Enter" && expiryYearRef.current?.focus()}
                        placeholder="MM"
                        className="mt-1 text-gray-800"
                        maxLength={2}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryYear" className="text-sm font-medium">
                        Yıl
                      </Label>
                      <Input
                        id="expiryYear"
                        ref={expiryYearRef}
                        value={expiryYear}
                        onChange={handleYearChange}
                        onKeyDown={(e) => e.key === "Enter" && cvvRef.current?.focus()}
                        placeholder="YY"
                        className="mt-1 text-gray-800"
                        maxLength={2}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv" className="text-sm font-medium">
                        CVC
                      </Label>
                      <Input
                        id="cvv"
                        ref={cvvRef}
                        value={cvv}
                        onChange={handleCVVChange}
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.form?.requestSubmit()}
                        placeholder="123"
                        className="mt-1 text-gray-800"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          İşleniyor...
                        </span>
                      ) : (
                        <span>{premiumConfig.price?.toLocaleString('tr-TR')},00 {premiumConfig.currency} ÖDE</span>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center mt-2">
                    Ödeme işlemine devam ederek <Link href="#" className="text-blue-500">KVKK Aydınlatma Metni</Link>'ni okuduğumu ve anladığımı kabul ediyorum.
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span">
          <Card className="mt-22">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Premium Erişim</CardTitle>
              <CardDescription className="text-sm">
                {premiumConfig.yearlyPriceText && premiumConfig.yearlyPriceText.includes('tek') ? 'Tek seferlik ödeme' : 'Tek seferlik ödeme'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-3 rounded-lg border border-amber-100 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-sm">Premium Erişim</h5>
                    <p className="text-xs text-gray-600">Kaliteli içerik</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">₺{premiumConfig.price?.toLocaleString('tr-TR')}</div>
                    <p className="text-xs text-gray-600">tek ödeme</p>
                  </div>
                </div>
              </div>
              
              {premiumConfig.features && premiumConfig.features.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-xs">Premium içerikler:</h5>
                  
                  {premiumConfig.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add a custom style to make input text darker */}
      <style jsx global>{`
        .text-gray-800::placeholder {
          color: #9ca3af;
        }
        .text-gray-800 {
          color: #1f2937;
        }
      `}</style>
    </div>
  );
} 