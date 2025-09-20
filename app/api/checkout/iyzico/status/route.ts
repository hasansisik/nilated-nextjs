import { NextRequest, NextResponse } from "next/server";
import Iyzipay from "iyzipay";
import { getGeneral } from "@/services/generalService";

export async function GET(req: NextRequest) {
  try {
    // Get token from query params
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Token is required" },
        { status: 400 }
      );
    }

    // Get general settings including iyzico API keys
    const general = await getGeneral();
    
    // Initialize iyzipay with settings from general
    const iyzipay = new Iyzipay({
      apiKey: general?.iyzico?.apiKey || "sandbox-OwAK76eKxLfPmFS3uF65m3yOsohhKD3B",
      secretKey: general?.iyzico?.secretKey || "sandbox-P5Ppp3OxgdCQnfbCoZcaUEacUdv54l6i",
      uri: general?.iyzico?.uri || "https://sandbox-api.iyzipay.com",
    });

    // Create request object for retrieving payment result
    const request = {
      locale: "tr",
      conversationId: "123456789",
      token: token
    };

    // Get payment result
    return new Promise((resolve) => {
      iyzipay.checkoutForm.retrieve(request, function (err: any, result: any) {
        if (err) {
          console.error("Iyzipay error:", err);
          resolve(
            NextResponse.json(
              { status: "error", message: "Error checking payment status" },
              { status: 500 }
            )
          );
        } else {
          resolve(
            NextResponse.json({
              status: "success",
              paymentStatus: result.paymentStatus,
              paymentId: result.paymentId,
              fraudStatus: result.fraudStatus,
              result: result
            })
          );
        }
      });
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { status: "error", message: "An error occurred checking payment status" },
      { status: 500 }
    );
  }
} 