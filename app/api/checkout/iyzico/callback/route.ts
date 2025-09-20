import { NextRequest, NextResponse } from "next/server";
import Iyzipay from "iyzipay";
import { getGeneral } from "@/services/generalService";

// Create HTML response that sends a message to parent window and also provides a fallback link
function createParentMessageResponse(status: string, token: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Ödeme Sonucu</title>
        <script>
          // Set validation flag in session storage for successful payments
          if ('${status}' === 'success') {
            try {
              sessionStorage.setItem('validPaymentCompletion', 'true');
            } catch (e) {
              console.error("Error setting session storage:", e);
            }
          }
          
          // Try to communicate with parent window
          try {
            window.parent.postMessage({ 
              type: 'PAYMENT_RESULT', 
              status: '${status}',
              token: '${token}'
            }, '*');
            
            // Wait a moment before showing the fallback
            setTimeout(function() {
              document.getElementById('fallback').style.display = 'block';
            }, 3000);
          } catch (e) {
            document.getElementById('fallback').style.display = 'block';
          }
        </script>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; text-align: center; }
          .container { max-width: 500px; margin: 0 auto; }
          .btn { display: inline-block; background: #ff5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; }
          #fallback { display: none; margin-top: 20px; }
          .spinner { border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: #ff5722; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 20px auto; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Ödeme İşleniyor</h2>
          <div class="spinner"></div>
          <p>Ana sayfaya otomatik olarak yönlendiriliyorsunuz...</p>
          
          <div id="fallback">
            <p>Otomatik yönlendirme çalışmadıysa aşağıdaki bağlantıyı kullanabilirsiniz:</p>
            <a class="btn" href="/${status === 'success' ? `odeme/basarili?token=${token}` : 'odeme/basarisiz'}">
              ${status === 'success' ? 'Ödeme Başarılı Sayfasına Git' : 'Ödeme Başarısız Sayfasına Git'}
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
  
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}

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
    
    const formData = await req.formData();
    const token = formData.get('token') as string;
    
    if (!token) {
      return createParentMessageResponse('error', '');
    }
    
    // Create request object for retrieving payment result
    const request: any = {
      locale: "tr",
      conversationId: "123456789",
      token: token
    };
    
    // Get payment result
    return new Promise((resolve) => {
      iyzipay.checkoutForm.retrieve(request, function (err: any, result: any) {
        if (err) {
          console.error("Iyzipay error:", err);
          resolve(createParentMessageResponse('error', token));
        } else {
          
          if (result.status === "success" && result.paymentStatus === "SUCCESS") {
            // Payment successful - could update database here
            resolve(createParentMessageResponse('success', token));
          } else {
            // Payment failed
            resolve(createParentMessageResponse('error', token));
          }
        }
      });
    });
    
  } catch (error) {
    console.error("Callback error:", error);
    return createParentMessageResponse('error', '');
  }
} 