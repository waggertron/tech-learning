package main

import "fmt"

type PaymentStrategy interface {
	Pay(amount float64)
}

type CreditCard struct{ CardNumber string }

func (c *CreditCard) Pay(amount float64) {
	last4 := c.CardNumber[len(c.CardNumber)-4:]
	fmt.Printf("Charged $%.2f to card ending %s\n", amount, last4)
}

type PayPal struct{ Email string }

func (p *PayPal) Pay(amount float64) {
	fmt.Printf("Sent $%.2f via PayPal to %s\n", amount, p.Email)
}

type Crypto struct{ Address string }

func (c *Crypto) Pay(amount float64) {
	fmt.Printf("Transferred $%.2f worth of BTC to %s\n", amount, c.Address)
}

type Checkout struct{ strategy PaymentStrategy }

func (c *Checkout) SetStrategy(s PaymentStrategy) { c.strategy = s }
func (c *Checkout) ProcessPayment(amount float64)  { c.strategy.Pay(amount) }

func main() {
	checkout := &Checkout{strategy: &CreditCard{CardNumber: "4111111111111111"}}
	checkout.ProcessPayment(99.99)
	// Charged $99.99 to card ending 1111

	checkout.SetStrategy(&PayPal{Email: "user@example.com"})
	checkout.ProcessPayment(49.99)
	// Sent $49.99 via PayPal to user@example.com

	checkout.SetStrategy(&Crypto{Address: "1A2B3C4D..."})
	checkout.ProcessPayment(19.99)
	// Transferred $19.99 worth of BTC to 1A2B3C4D...
}
