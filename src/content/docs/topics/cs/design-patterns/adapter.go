package main

import (
	"fmt"
	"math"
)

// Target interface
type PaymentProcessor interface {
	Charge(amount float64, currency string) bool
	Refund(transactionID string) bool
}

// Adaptee (legacy, cannot be changed)
type LegacyPaymentGateway struct{}

func (g *LegacyPaymentGateway) MakePayment(cents int, currencyCode string) int {
	fmt.Printf("Legacy: charging %d cents in %s\n", cents, currencyCode)
	return 0 // 0 = success
}

func (g *LegacyPaymentGateway) ReverseTransaction(id string) bool {
	fmt.Printf("Legacy: reversing %s\n", id)
	return true
}

// Adapter
type LegacyPaymentAdapter struct {
	gateway *LegacyPaymentGateway
}

// Compile-time interface check
var _ PaymentProcessor = (*LegacyPaymentAdapter)(nil)

func (a *LegacyPaymentAdapter) Charge(amount float64, currency string) bool {
	cents := int(math.Round(amount * 100))
	result := a.gateway.MakePayment(cents, currency)
	return result == 0
}

func (a *LegacyPaymentAdapter) Refund(transactionID string) bool {
	return a.gateway.ReverseTransaction(transactionID)
}

func processOrder(p PaymentProcessor, total float64) {
	ok := p.Charge(total, "USD")
	if ok {
		fmt.Println("Payment accepted")
	} else {
		fmt.Println("Payment failed")
	}
}

func main() {
	adapter := &LegacyPaymentAdapter{gateway: &LegacyPaymentGateway{}}
	processOrder(adapter, 29.99)
	// Legacy: charging 2999 cents in USD
	// Payment accepted
}
