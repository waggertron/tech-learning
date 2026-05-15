interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCard implements PaymentStrategy {
  constructor(private cardNumber: string) {}
  pay(amount: number): void {
    console.log(
      `Charged $${amount} to card ending ${this.cardNumber.slice(-4)}`
    );
  }
}

class PayPal implements PaymentStrategy {
  constructor(private email: string) {}
  pay(amount: number): void {
    console.log(`Sent $${amount} via PayPal to ${this.email}`);
  }
}

class Crypto implements PaymentStrategy {
  constructor(private address: string) {}
  pay(amount: number): void {
    console.log(`Transferred $${amount} worth of BTC to ${this.address}`);
  }
}

class Checkout {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  processPayment(amount: number): void {
    this.strategy.pay(amount);
  }
}

const checkout = new Checkout(new CreditCard('4111111111111111'));
checkout.processPayment(99.99);
// Charged $99.99 to card ending 1111

checkout.setStrategy(new PayPal('user@example.com'));
checkout.processPayment(49.99);
// Sent $49.99 via PayPal to user@example.com

checkout.setStrategy(new Crypto('1A2B3C4D...'));
checkout.processPayment(19.99);
// Transferred $19.99 worth of BTC to 1A2B3C4D...
