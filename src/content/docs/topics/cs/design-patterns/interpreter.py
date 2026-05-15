from __future__ import annotations
from typing import Protocol


Context = dict[str, bool]


class AbstractExpression(Protocol):
    def interpret(self, context: Context) -> bool: ...


class Variable:
    def __init__(self, name: str) -> None:
        self._name = name

    def interpret(self, context: Context) -> bool:
        return context.get(self._name, False)


class AndExpression:
    def __init__(self, left: AbstractExpression, right: AbstractExpression) -> None:
        self._left = left
        self._right = right

    def interpret(self, context: Context) -> bool:
        return self._left.interpret(context) and self._right.interpret(context)


class OrExpression:
    def __init__(self, left: AbstractExpression, right: AbstractExpression) -> None:
        self._left = left
        self._right = right

    def interpret(self, context: Context) -> bool:
        return self._left.interpret(context) or self._right.interpret(context)


class NotExpression:
    def __init__(self, operand: AbstractExpression) -> None:
        self._operand = operand

    def interpret(self, context: Context) -> bool:
        return not self._operand.interpret(context)


# (x AND y) OR (NOT z)
x, y, z = Variable('x'), Variable('y'), Variable('z')
expr = OrExpression(AndExpression(x, y), NotExpression(z))

ctx = {'x': True, 'y': False, 'z': False}
print(expr.interpret(ctx))  # True  (NOT z is true)

ctx2 = {'x': True, 'y': True, 'z': True}
print(expr.interpret(ctx2))  # True  (x AND y is true)
