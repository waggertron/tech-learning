from abc import ABC, abstractmethod

# Implementation side
class Device(ABC):
    @abstractmethod
    def is_enabled(self) -> bool: ...

    @abstractmethod
    def enable(self) -> None: ...

    @abstractmethod
    def disable(self) -> None: ...

    @abstractmethod
    def get_volume(self) -> int: ...

    @abstractmethod
    def set_volume(self, percent: int) -> None: ...

    @abstractmethod
    def get_channel(self) -> int: ...

    @abstractmethod
    def set_channel(self, channel: int) -> None: ...


class TV(Device):
    def __init__(self) -> None:
        self._on = False
        self._volume = 30
        self._channel = 1

    def is_enabled(self) -> bool: return self._on
    def enable(self) -> None:
        self._on = True
        print("TV: powered on")
    def disable(self) -> None:
        self._on = False
        print("TV: powered off")
    def get_volume(self) -> int: return self._volume
    def set_volume(self, percent: int) -> None:
        self._volume = max(0, min(100, percent))
        print(f"TV: volume set to {self._volume}")
    def get_channel(self) -> int: return self._channel
    def set_channel(self, channel: int) -> None:
        self._channel = channel
        print(f"TV: channel set to {self._channel}")


class Radio(Device):
    def __init__(self) -> None:
        self._on = False
        self._volume = 50
        self._channel = 1

    def is_enabled(self) -> bool: return self._on
    def enable(self) -> None:
        self._on = True
        print("Radio: powered on")
    def disable(self) -> None:
        self._on = False
        print("Radio: powered off")
    def get_volume(self) -> int: return self._volume
    def set_volume(self, percent: int) -> None:
        self._volume = max(0, min(100, percent))
        print(f"Radio: volume set to {self._volume}")
    def get_channel(self) -> int: return self._channel
    def set_channel(self, channel: int) -> None:
        self._channel = channel
        print(f"Radio: channel set to {self._channel}")


# Abstraction side
class RemoteControl(ABC):
    def __init__(self, device: Device) -> None:
        self._device = device

    def toggle_power(self) -> None:
        if self._device.is_enabled():
            self._device.disable()
        else:
            self._device.enable()

    def volume_down(self) -> None:
        self._device.set_volume(self._device.get_volume() - 10)

    def volume_up(self) -> None:
        self._device.set_volume(self._device.get_volume() + 10)

    def channel_down(self) -> None:
        self._device.set_channel(self._device.get_channel() - 1)

    def channel_up(self) -> None:
        self._device.set_channel(self._device.get_channel() + 1)


class BasicRemote(RemoteControl):
    pass  # All behavior inherited from RemoteControl.


class AdvancedRemote(RemoteControl):
    def mute(self) -> None:
        print("AdvancedRemote: muting device")
        self._device.set_volume(0)


# Swapping the device at construction time changes behavior without
# changing either remote class.
tv = TV()
radio = Radio()

basic = BasicRemote(tv)
basic.toggle_power()   # TV: powered on
basic.volume_up()      # TV: volume set to 40

advanced = AdvancedRemote(radio)
advanced.toggle_power()  # Radio: powered on
advanced.mute()           # Radio: volume set to 0

# Hand the same AdvancedRemote a TV instead.
tv_advanced = AdvancedRemote(tv)
tv_advanced.mute()  # TV: volume set to 0
