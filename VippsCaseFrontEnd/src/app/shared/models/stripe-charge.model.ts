import { StripeCustomer } from './stripe-customer.model';

export interface StripeCharge {
    paymentMethodId: string;
    paymentIntentId: string;
    totalCost: number;
    userId: number;
    cartId: number;
    customerDetails: StripeCustomer;
}
