from __future__ import annotations
from typing import Protocol


class TrafficLightState(Protocol):
    def next(self, context: TrafficLight) -> None: ...
    def get_color(self) -> str: ...


class RedState:
    def next(self, context: TrafficLight) -> None:
        context.set_state(GreenState())

    def get_color(self) -> str:
        return 'Red'


class GreenState:
    def next(self, context: TrafficLight) -> None:
        context.set_state(YellowState())

    def get_color(self) -> str:
        return 'Green'


class YellowState:
    def next(self, context: TrafficLight) -> None:
        context.set_state(RedState())

    def get_color(self) -> str:
        return 'Yellow'


class TrafficLight:
    def __init__(self) -> None:
        self._state: TrafficLightState = RedState()

    def set_state(self, state: TrafficLightState) -> None:
        self._state = state

    def next(self) -> None:
        self._state.next(self)

    def get_color(self) -> str:
        return self._state.get_color()


light = TrafficLight()
print(light.get_color())  # Red
light.next()
print(light.get_color())  # Green
light.next()
print(light.get_color())  # Yellow
light.next()
print(light.get_color())  # Red
