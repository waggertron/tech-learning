from __future__ import annotations
from typing import Protocol


class PaymentStrategy(Protocol):
    def pay(self, amount: float) -> None: ...


class CreditCard:
    def __init__(self, card_number: str) -> None:
        self._card = card_number

    def pay(self, amount: float) -> None:
        print(f'Charged ${amount} to card ending {self._card[-4:]}')


class PayPal:
    def __init__(self, email: str) -> None:
        self._email = email

    def pay(self, amount: float) -> None:
        print(f'Sent ${amount} via PayPal to {self._email}')


class Crypto:
    def __init__(self, address: str) -> None:
        self._address = address

    def pay(self, amount: float) -> None:
        print(f'Transferred ${amount} worth of BTC to {self._address}')


class Checkout:
    def __init__(self, strategy: PaymentStrategy) -> None:
        self._strategy = strategy

    def set_strategy(self, strategy: PaymentStrategy) -> None:
        self._strategy = strategy

    def process_payment(self, amount: float) -> None:
        self._strategy.pay(amount)


checkout = Checkout(CreditCard('4111111111111111'))
checkout.process_payment(99.99)
# Charged $99.99 to card ending 1111

checkout.set_strategy(PayPal('user@example.com'))
checkout.process_payment(49.99)
# Sent $49.99 via PayPal to user@example.com
