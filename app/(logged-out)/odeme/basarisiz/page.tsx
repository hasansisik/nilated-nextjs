"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailure() {
  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card className="shadow-md border-red-100">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <CardTitle className="text-xl">Ödeme Başarısız</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz veya farklı bir ödeme yöntemi seçiniz.
          </p>
          
          <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
            <Link href="/odeme">Tekrar Dene</Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full mt-3">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 