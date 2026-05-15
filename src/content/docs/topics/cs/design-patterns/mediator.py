from __future__ import annotations
from typing import Protocol


class Mediator(Protocol):
    def register(self, user: User) -> None: ...
    def send(self, sender: User, message: str) -> None: ...


class ChatRoom:
    def __init__(self) -> None:
        self._participants: list[User] = []

    def register(self, user: User) -> None:
        self._participants.append(user)
        user.set_mediator(self)

    def send(self, sender: User, message: str) -> None:
        for participant in self._participants:
            if participant is not sender:
                participant.receive(sender.name, message)


class User:
    def __init__(self, name: str) -> None:
        self.name = name
        self._mediator: Mediator | None = None

    def set_mediator(self, mediator: Mediator) -> None:
        self._mediator = mediator

    def send(self, message: str) -> None:
        print(f'{self.name} sends: "{message}"')
        if self._mediator:
            self._mediator.send(self, message)

    def receive(self, from_name: str, message: str) -> None:
        print(f'{self.name} receives from {from_name}: "{message}"')


room = ChatRoom()
alice, bob, carol = User('Alice'), User('Bob'), User('Carol')
for user in (alice, bob, carol):
    room.register(user)

alice.send('Hello, everyone!')
# Alice sends: "Hello, everyone!"
# Bob receives from Alice: "Hello, everyone!"
# Carol receives from Alice: "Hello, everyone!"
