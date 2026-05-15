// New interface the rest of the application expects
interface PaymentProcessor {
  charge(amount: number, currency: string): boolean;
  refund(transactionId: string): boolean;
}

// Legacy system we cannot modify
class LegacyPaymentGateway {
  makePayment(cents: number, currencyCode: string): number {
    console.log(`Legacy: charging ${cents} cents in ${currencyCode}`);
    return 0; // 0 = success
  }

  reverseTransaction(transactionId: string): boolean {
    console.log(`Legacy: reversing ${transactionId}`);
    return true;
  }
}

// Adapter: implements the new interface, delegates to the old one
class LegacyPaymentAdapter implements PaymentProcessor {
  constructor(private gateway: LegacyPaymentGateway) {}

  charge(amount: number, currency: string): boolean {
    const cents = Math.round(amount * 100);
    const result = this.gateway.makePayment(cents, currency.toUpperCase());
    return result === 0;
  }

  refund(transactionId: string): boolean {
    return this.gateway.reverseTransaction(transactionId);
  }
}

// Client code uses only PaymentProcessor; legacy details are hidden
function processOrder(processor: PaymentProcessor, total: number): void {
  const ok = processor.charge(total, 'usd');
  console.log(ok ? 'Payment accepted' : 'Payment failed');
}

const adapter = new LegacyPaymentAdapter(new LegacyPaymentGateway());
processOrder(adapter, 29.99);
// Legacy: charging 2999 cents in USD
// Payment accepted
