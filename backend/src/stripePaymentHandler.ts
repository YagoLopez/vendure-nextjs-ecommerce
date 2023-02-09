// import { sdk } from 'payment-provider-sdk';
import { PaymentMethodHandler, CreatePaymentResult, SettlePaymentResult, SettlePaymentErrorResult } from '@vendure/core';
import { LanguageCode } from '@vendure/payments-plugin/package/mollie/graphql/generated-shop-types'

/**
 * This is a handler which integrates Vendure with an imaginary
 * payment provider, who provide a Node SDK which we use to
 * interact with their APIs.
 */
export const stripePaymenHandler = new PaymentMethodHandler({
  code: 'strype-payment-method',
  description: [{
    languageCode: LanguageCode.en,
    value: 'Stripe Payment Provider',
  }],
  args: {
    apiKey: { type: 'string' },
  },

  /** This is called when the `addPaymentToOrder` mutation is executed */
  createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {

    console.log('create stripe payment-------------------------------')
    /*
    try {
      const result = await sdk.charges.create({
        amount,
        apiKey: args.apiKey,
        source: metadata.token,
      });
      return {
        amount: order.total,
        state: 'Authorized' as const,
        transactionId: result.id.toString(),
        metadata: {
          cardInfo: result.cardInfo,
          // Any metadata in the `public` field
          // will be available in the Shop API,
          // All other metadata is private and
          // only available in the Admin API.
          public: {
            referenceCode: result.publicId,
          }
        },
      };
    } catch (err) {
      return {
        amount: order.total,
        state: 'Declined' as const,
        metadata: {
          errorMessage: err.message,
        },
      };
    }
    */
    return {
      amount: order.total,
      state: 'Authorized' as const,
      metadata: {
        errorMessage: 'Error!',
      },
    }

    },

  /** This is called when the `settlePayment` mutation is executed */
  settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {

    console.log('settle stripe payment-------------------------------')

    /*
    try {
      const result = await sdk.charges.capture({
        apiKey: args.apiKey,
        id: payment.transactionId,
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        errorMessage: err.message,
      }
    }
  */
    return {success: true}
  },
});

/**
 * We now add this handler to our config
 */
/*
export const config: VendureConfig = {
  // ...
  paymentOptions: {
    paymentMethodHandlers: [stripePaymenHandler],
  },
};*/
