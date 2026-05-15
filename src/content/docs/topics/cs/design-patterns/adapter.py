from __future__ import annotations
from abc import ABC, abstractmethod


class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount: float, currency: str) -> bool: ...

    @abstractmethod
    def refund(self, transaction_id: str) -> bool: ...


class LegacyPaymentGateway:
    def make_payment(self, cents: int, currency_code: str) -> int:
        print(f'Legacy: charging {cents} cents in {currency_code}')
        return 0  # 0 = success

    def reverse_transaction(self, transaction_id: str) -> bool:
        print(f'Legacy: reversing {transaction_id}')
        return True


class LegacyPaymentAdapter(PaymentProcessor):
    def __init__(self, gateway: LegacyPaymentGateway) -> None:
        self._gateway = gateway

    def charge(self, amount: float, currency: str) -> bool:
        cents = round(amount * 100)
        result = self._gateway.make_payment(cents, currency.upper())
        return result == 0

    def refund(self, transaction_id: str) -> bool:
        return self._gateway.reverse_transaction(transaction_id)


def process_order(processor: PaymentProcessor, total: float) -> None:
    ok = processor.charge(total, 'usd')
    print('Payment accepted' if ok else 'Payment failed')


adapter = LegacyPaymentAdapter(LegacyPaymentGateway())
process_order(adapter, 29.99)
# Legacy: charging 2999 cents in USD
# Payment accepted
