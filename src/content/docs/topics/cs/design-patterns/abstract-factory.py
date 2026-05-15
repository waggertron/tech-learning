from abc import ABC, abstractmethod
import os


# Product interfaces
class Button(ABC):
    @abstractmethod
    def render(self) -> None:
        ...

    @abstractmethod
    def on_click(self) -> None:
        ...


class Checkbox(ABC):
    @abstractmethod
    def render(self) -> None:
        ...

    @abstractmethod
    def toggle(self) -> None:
        ...


# Abstract factory
class UIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        ...

    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        ...


# Light theme products
class LightButton(Button):
    def render(self) -> None:
        print("Rendering light button: white background, dark border")

    def on_click(self) -> None:
        print("Light button clicked")


class LightCheckbox(Checkbox):
    def __init__(self) -> None:
        self._checked = False

    def render(self) -> None:
        state = "checked" if self._checked else "unchecked"
        print(f"Rendering light checkbox: {state}")

    def toggle(self) -> None:
        self._checked = not self._checked
        print(f"Light checkbox toggled to {self._checked}")


# Dark theme products
class DarkButton(Button):
    def render(self) -> None:
        print("Rendering dark button: dark background, light border")

    def on_click(self) -> None:
        print("Dark button clicked")


class DarkCheckbox(Checkbox):
    def __init__(self) -> None:
        self._checked = False

    def render(self) -> None:
        state = "checked" if self._checked else "unchecked"
        print(f"Rendering dark checkbox: {state}")

    def toggle(self) -> None:
        self._checked = not self._checked
        print(f"Dark checkbox toggled to {self._checked}")


# Concrete factories
class LightFactory(UIFactory):
    def create_button(self) -> Button:
        return LightButton()

    def create_checkbox(self) -> Checkbox:
        return LightCheckbox()


class DarkFactory(UIFactory):
    def create_button(self) -> Button:
        return DarkButton()

    def create_checkbox(self) -> Checkbox:
        return DarkCheckbox()


# Client -- knows nothing about concrete classes
def render_settings_panel(factory: UIFactory) -> None:
    button = factory.create_button()
    checkbox = factory.create_checkbox()

    button.render()
    checkbox.render()
    checkbox.toggle()
    button.on_click()


# Usage
theme = os.environ.get("THEME", "light")
factory: UIFactory = DarkFactory() if theme == "dark" else LightFactory()
render_settings_panel(factory)
