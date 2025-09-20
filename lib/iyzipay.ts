import Iyzipay from 'iyzipay';

// Iyzipay configuration
export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY || 'sandbox-apiKey',
  secretKey: process.env.IYZIPAY_SECRET_KEY || 'sandbox-secretKey',
  uri: process.env.IYZIPAY_URI || 'https://sandbox-api.iyzipay.com'
});

// Generate a unique conversation ID for iyzico
export function generateConversationId(): string {
  return `wordpress-clone-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

// Format price for iyzico (expected as string with two decimals)
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

// Helper function to create checkout form initialization
export async function createCheckoutForm(params: {
  price: number;
  paidPrice: number;
  callbackUrl: string;
  buyerInfo: {
    id: string;
    name: string;
    surname: string;
    email: string;
    identityNumber: string;
    phone: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
    ip: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
  }>;
}) {
  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: generateConversationId(),
    price: formatPrice(params.price),
    paidPrice: formatPrice(params.paidPrice),
    currency: Iyzipay.CURRENCY.TRY,
    basketId: `basket-${Date.now()}`,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: params.callbackUrl,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: params.buyerInfo.id,
      name: params.buyerInfo.name,
      surname: params.buyerInfo.surname,
      gsmNumber: params.buyerInfo.phone,
      email: params.buyerInfo.email,
      identityNumber: params.buyerInfo.identityNumber || '74300864791', // TC kimlik no. Default is example value
      lastLoginDate: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
      registrationDate: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
      registrationAddress: params.buyerInfo.address,
      ip: params.buyerInfo.ip,
      city: params.buyerInfo.city,
      country: params.buyerInfo.country,
      zipCode: params.buyerInfo.zipCode || '34732'
    },
    shippingAddress: {
      contactName: params.billingAddress.contactName,
      city: params.billingAddress.city,
      country: params.billingAddress.country,
      address: params.billingAddress.address,
      zipCode: params.billingAddress.zipCode || '34742'
    },
    billingAddress: {
      contactName: params.billingAddress.contactName,
      city: params.billingAddress.city,
      country: params.billingAddress.country,
      address: params.billingAddress.address,
      zipCode: params.billingAddress.zipCode || '34742'
    },
    basketItems: params.basketItems.map(item => ({
      id: item.id,
      name: item.name,
      category1: item.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: formatPrice(item.price)
    }))
  };

  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Retrieve checkout form payment result
export async function retrieveCheckoutFormResult(token: string) {
  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: generateConversationId(),
    token: token
  };

  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(request, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
} 