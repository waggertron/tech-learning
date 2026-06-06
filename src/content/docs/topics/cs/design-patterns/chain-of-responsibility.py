from __future__ import annotations


class Handler:
    def set_next(self, handler: Handler) -> Handler:
        raise NotImplementedError

    def handle(self, request: str) -> str | None:
        raise NotImplementedError


class BaseHandler(Handler):
    def __init__(self) -> None:
        self._next: Handler | None = None

    def set_next(self, handler: Handler) -> Handler:
        self._next = handler
        return handler

    def handle(self, request: str) -> str | None:
        if self._next:
            return self._next.handle(request)
        return None


class Level1Support(BaseHandler):
    def handle(self, request: str) -> str | None:
        if request == 'password-reset':
            return 'Level 1 resolved: password reset'
        return super().handle(request)


class Level2Support(BaseHandler):
    def handle(self, request: str) -> str | None:
        if request == 'billing-dispute':
            return 'Level 2 resolved: billing dispute'
        return super().handle(request)


class Level3Support(BaseHandler):
    def handle(self, request: str) -> str | None:
        if request == 'data-corruption':
            return 'Level 3 resolved: data corruption'
        return super().handle(request)


l1 = Level1Support()
l2 = Level2Support()
l3 = Level3Support()
l1.set_next(l2).set_next(l3)

print(l1.handle('password-reset'))   # Level 1 resolved: password reset
print(l1.handle('billing-dispute'))  # Level 2 resolved: billing dispute
print(l1.handle('data-corruption'))  # Level 3 resolved: data corruption
print(l1.handle('unknown'))          # None
