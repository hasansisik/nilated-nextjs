"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { retrieveCheckoutFormResult } from "@/lib/iyzipay";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Ödeme token'ı bulunamadı.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const result = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await result.json();
        
        if (data.status === "success" && data.paymentStatus === "SUCCESS") {
          setStatus("success");
          setMessage("Ödemeniz başarıyla tamamlandı!");
        } else {
          setStatus("error");
          setMessage(data.errorMessage || "Ödeme işlemi başarısız oldu.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage("Ödeme doğrulanırken bir hata oluştu.");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="container max-w-md mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      {status === "loading" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Ödeme Doğrulanıyor</h2>
          <p className="text-gray-600">Lütfen bekleyin, ödemeniz doğrulanıyor...</p>
        </div>
      )}
      
      {status === "success" && (
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Ödeme Başarılı</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      )}
      
      {status === "error" && (
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Ödeme Başarısız</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-4">
            <Link href="/checkout/premium">
              <Button variant="outline">
                Tekrar Dene
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Ana Sayfaya Dön
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 