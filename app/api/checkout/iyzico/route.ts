import { NextRequest, NextResponse } from "next/server";
import Iyzipay from "iyzipay";
import { getGeneral } from "@/services/generalService";

export async function POST(req: NextRequest) {
  try {
    // Get general settings including iyzico API keys
    const general = await getGeneral();
    
    // Initialize iyzipay with settings from general
    const iyzipay = new Iyzipay({
      apiKey: general?.iyzico?.apiKey || "sandbox-OwAK76eKxLfPmFS3uF65m3yOsohhKD3B",
      secretKey: general?.iyzico?.secretKey || "sandbox-P5Ppp3OxgdCQnfbCoZcaUEacUdv54l6i",
      uri: general?.iyzico?.uri || "https://sandbox-api.iyzipay.com",
    });

    // Parse request body
    const body = await req.json();
    const { callbackUrl } = body;

    // Create a unique conversation ID
    const conversationId = `wordpress_clone_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create the checkout form initialization request
    const request = {
      locale: "tr",
      conversationId: conversationId,
      price: "149.00",
      paidPrice: "149.00",
      currency: "TRY",
      basketId: `basket_${Date.now()}`,
      paymentGroup: "PRODUCT",
      callbackUrl: callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "email@email.com",
        identityNumber: "74300864791",
        lastLoginDate: "2020-10-05 12:43:35",
        registrationDate: "2013-04-21 15:12:09",
        registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732",
      },
      shippingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      billingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      basketItems: [
        {
          id: "BI101",
          name: "Premium Access",
          category1: "Subscription",
          category2: "Premium",
          itemType: "VIRTUAL",
          price: "149.00",
        },
      ],
    };

    // Create the checkout form
    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(request, function (err: any, result: any) {
        if (err) {
          console.error("Iyzipay error:", err);
          resolve(
            NextResponse.json(
              { status: "error", message: "Payment form creation failed" },
              { status: 500 }
            )
          );
        } else {
          resolve(
            NextResponse.json(
              {
                status: "success",
                paymentPageUrl: result.paymentPageUrl,
                token: result.token,
              },
              { status: 200 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { status: "error", message: "An error occurred during checkout" },
      { status: 500 }
    );
  }
} 