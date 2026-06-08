import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export interface PaymentIntentResult {
  id: string;
  clientSecret: string | null;
}

/**
 * Abstracts payment-intent creation. When STRIPE_SECRET_KEY is configured it
 * uses real Stripe (test mode); otherwise it falls back to a built-in sandbox
 * that mirrors the PaymentIntent lifecycle so the checkout flow is fully
 * demoable without external keys.
 */
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe | null;

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('stripe.secretKey');
    this.stripe = key ? new Stripe(key) : null;
    if (!this.stripe) {
      this.logger.warn('No STRIPE_SECRET_KEY set — using built-in sandbox payments.');
    }
  }

  get sandbox(): boolean {
    return this.stripe === null;
  }

  async createIntent(amountEurCents: number, orderId: string): Promise<PaymentIntentResult> {
    if (this.stripe) {
      const intent = await this.stripe.paymentIntents.create({
        amount: amountEurCents,
        currency: 'eur',
        metadata: { orderId },
        automatic_payment_methods: { enabled: true },
      });
      return { id: intent.id, clientSecret: intent.client_secret };
    }
    return { id: `pi_sandbox_${randomUUID()}`, clientSecret: null };
  }

  /** Verify and parse a Stripe webhook. Throws if Stripe isn't configured. */
  verifyWebhook(rawBody: Buffer, signature: string): Stripe.Event {
    const secret = this.config.get<string>('stripe.webhookSecret');
    if (!this.stripe || !secret) {
      throw new Error('Stripe webhook is not configured');
    }
    return this.stripe.webhooks.constructEvent(rawBody, signature, secret);
  }
}
