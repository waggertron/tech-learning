type Listener<T> = (data: T) => void;

class EventEmitter<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<unknown>>>();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener as Listener<unknown>);
    this.listeners.set(event, set);
    return this;
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
    return this;
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners.get(event)?.forEach(l => l(data));
  }
}

// Usage: stock market with typed events
interface MarketEvents {
  priceChange: { symbol: string; price: number };
  marketClose: { timestamp: number };
}

const market = new EventEmitter<MarketEvents>();

const priceLogger = (e: { symbol: string; price: number }) =>
  console.log(`${e.symbol}: $${e.price}`);

market.on('priceChange', priceLogger);
market.on('priceChange', e => {
  if (e.price > 1000) console.log(`Alert: ${e.symbol} exceeded $1000`);
});

market.emit('priceChange', { symbol: 'AAPL', price: 185.5 });
// AAPL: $185.5

market.emit('priceChange', { symbol: 'GOOG', price: 1050.0 });
// GOOG: $1050
// Alert: GOOG exceeded $1000

market.off('priceChange', priceLogger);
market.emit('priceChange', { symbol: 'AAPL', price: 186.0 });
// (only alert observer fires now)
