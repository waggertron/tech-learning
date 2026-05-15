from __future__ import annotations
from collections import defaultdict
from typing import Callable


class EventEmitter:
    def __init__(self) -> None:
        self._listeners: dict[str, list[Callable]] = defaultdict(list)

    def on(self, event: str, listener: Callable) -> None:
        self._listeners[event].append(listener)

    def off(self, event: str, listener: Callable) -> None:
        self._listeners[event] = [
            l for l in self._listeners[event] if l is not listener
        ]

    def emit(self, event: str, **kwargs) -> None:
        for listener in list(self._listeners[event]):
            listener(**kwargs)


market = EventEmitter()

def log_price(symbol: str, price: float) -> None:
    print(f'{symbol}: ${price}')

def alert_high(symbol: str, price: float) -> None:
    if price > 1000:
        print(f'Alert: {symbol} exceeded $1000')

market.on('price_change', log_price)
market.on('price_change', alert_high)

market.emit('price_change', symbol='AAPL', price=185.5)
# AAPL: $185.5

market.emit('price_change', symbol='GOOG', price=1050.0)
# GOOG: $1050.0
# Alert: GOOG exceeded $1000

market.off('price_change', log_price)
market.emit('price_change', symbol='AAPL', price=186.0)
# (only alert fires)
