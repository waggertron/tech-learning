from __future__ import annotations
from abc import ABC, abstractmethod


class Notification(ABC):
    @abstractmethod
    def send(self, message: str) -> None: ...


class EmailNotification(Notification):
    def __init__(self, address: str) -> None:
        self._address = address

    def send(self, message: str) -> None:
        print(f'Email to {self._address}: {message}')


class SMSNotification(Notification):
    def __init__(self, phone: str) -> None:
        self._phone = phone

    def send(self, message: str) -> None:
        print(f'SMS to {self._phone}: {message}')


class PushNotification(Notification):
    def __init__(self, device_id: str) -> None:
        self._device_id = device_id

    def send(self, message: str) -> None:
        print(f'Push to {self._device_id}: {message}')


def create_notification(type_: str, destination: str) -> Notification:
    match type_:
        case 'email': return EmailNotification(destination)
        case 'sms':   return SMSNotification(destination)
        case 'push':  return PushNotification(destination)
        case _: raise ValueError(f'Unknown type: {type_}')


class NotificationService(ABC):
    @abstractmethod
    def create_notification(self, destination: str) -> Notification: ...

    def notify(self, destination: str, message: str) -> None:
        notification = self.create_notification(destination)
        notification.send(message)


class EmailService(NotificationService):
    def create_notification(self, destination: str) -> Notification:
        return EmailNotification(destination)


n = create_notification('email', 'user@example.com')
n.send('Your order shipped')
# Email to user@example.com: Your order shipped

service = EmailService()
service.notify('admin@example.com', 'Server alert')
# Email to admin@example.com: Server alert
