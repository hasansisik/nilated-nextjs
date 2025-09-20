// Extended types for iyzipay that might not be included in @types/iyzipay

declare namespace Iyzipay {
  interface CheckoutFormInitializeRequest {
    locale?: string;
    conversationId?: string;
    price: string;
    paidPrice: string;
    currency: string;
    basketId: string;
    paymentGroup?: string;
    callbackUrl: string;
    enabledInstallments?: string[];
    buyer: {
      id: string;
      name: string;
      surname: string;
      gsmNumber: string;
      email: string;
      identityNumber: string;
      registrationAddress: string;
      ip: string;
      city: string;
      country: string;
    };
    shippingAddress: {
      contactName: string;
      city: string;
      country: string;
      address: string;
    };
    billingAddress: {
      contactName: string;
      city: string;
      country: string;
      address: string;
    };
    basketItems: Array<{
      id: string;
      name: string;
      category1?: string;
      category2?: string;
      itemType: string;
      price: string;
      subMerchantKey?: string;
      subMerchantPrice?: string;
    }>;
  }

  interface CheckoutFormResponse {
    status: string;
    errorCode?: string;
    errorMessage?: string;
    errorGroup?: string;
    locale: string;
    systemTime: number;
    conversationId: string;
    token: string;
    checkoutFormContent: string;
    tokenExpireTime: number;
    paymentPageUrl: string;
  }

  interface RetrieveCheckoutFormRequest {
    locale?: string;
    conversationId?: string;
    token: string;
  }

  interface RetrieveCheckoutFormResponse {
    status: string;
    errorCode?: string;
    errorMessage?: string;
    errorGroup?: string;
    locale: string;
    systemTime: number;
    conversationId: string;
    token: string;
    paymentId?: string;
    paymentStatus?: string;
    price: string;
    paidPrice: string;
    installment: number;
    fraudStatus?: number;
    cardType?: string;
    cardAssociation?: string;
    cardFamily?: string;
    binNumber?: string;
    lastFourDigits?: string;
    basketId: string;
    currency?: string;
    itemTransactions?: Array<{
      itemId: string;
      paymentTransactionId: string;
      transactionStatus: number;
      price: string;
      paidPrice: string;
      merchantCommissionRate: string;
      merchantCommissionRateAmount: string;
      iyziCommissionRateAmount: string;
      iyziCommissionFee: string;
      blockageRate: string;
      blockageRateAmountMerchant: string;
      blockageRateAmountSubMerchant: string;
      blockageResolvedDate: string;
      subMerchantPrice: string;
      subMerchantPayoutRate: string;
      subMerchantPayoutAmount: string;
      merchantPayoutAmount: string;
      convertedPayout: {
        paidPrice: string;
        iyziCommissionRateAmount: string;
        iyziCommissionFee: string;
        blockageRateAmountMerchant: string;
        blockageRateAmountSubMerchant: string;
        subMerchantPayoutAmount: string;
        merchantPayoutAmount: string;
        iyziConversionRate: string;
        iyziConversionRateAmount: string;
        currency: string;
      };
    }>;
  }
}

export = Iyzipay; 