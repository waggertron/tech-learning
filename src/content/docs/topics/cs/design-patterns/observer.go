package main

import (
	"fmt"
	"sync"
)

type PriceEvent struct {
	Symbol string
	Price  float64
}

type PriceObserver interface {
	OnPriceChange(PriceEvent)
}

type Market struct {
	mu        sync.RWMutex
	observers []PriceObserver
}

func (m *Market) Subscribe(o PriceObserver) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.observers = append(m.observers, o)
}

func (m *Market) Unsubscribe(o PriceObserver) {
	m.mu.Lock()
	defer m.mu.Unlock()
	out := m.observers[:0]
	for _, obs := range m.observers {
		if obs != o {
			out = append(out, obs)
		}
	}
	m.observers = out
}

func (m *Market) SetPrice(symbol string, price float64) {
	event := PriceEvent{Symbol: symbol, Price: price}
	m.mu.RLock()
	snapshot := make([]PriceObserver, len(m.observers))
	copy(snapshot, m.observers)
	m.mu.RUnlock()
	for _, o := range snapshot {
		o.OnPriceChange(event)
	}
}

type Logger struct{}

func (l *Logger) OnPriceChange(e PriceEvent) {
	fmt.Printf("%s: $%.2f\n", e.Symbol, e.Price)
}

type AlertObserver struct{ Threshold float64 }

func (a *AlertObserver) OnPriceChange(e PriceEvent) {
	if e.Price > a.Threshold {
		fmt.Printf("Alert: %s exceeded $%.0f\n", e.Symbol, a.Threshold)
	}
}

func main() {
	m := &Market{}
	logger := &Logger{}
	m.Subscribe(logger)
	m.Subscribe(&AlertObserver{Threshold: 1000})

	m.SetPrice("AAPL", 185.5)
	// AAPL: $185.50

	m.SetPrice("GOOG", 1050.0)
	// GOOG: $1050.00
	// Alert: GOOG exceeded $1000

	m.Unsubscribe(logger)
	m.SetPrice("AAPL", 186.0)
	// (only alert fires)
}
