from __future__ import annotations


# Approach 1: __new__ override
class AppConfig:
    _instance: AppConfig | None = None

    def __new__(cls) -> AppConfig:
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._settings: dict[str, str] = {}
        return cls._instance

    def get(self, key: str) -> str | None:
        return self._settings.get(key)

    def set(self, key: str, value: str) -> None:
        self._settings[key] = value


config1 = AppConfig()
config2 = AppConfig()
print(config1 is config2)  # True

config1.set('env', 'production')
print(config2.get('env'))  # production


# Approach 2: module-level instance (most Pythonic)
class _Config:
    def __init__(self) -> None:
        self._settings: dict[str, str] = {}

    def get(self, key: str) -> str | None:
        return self._settings.get(key)

    def set(self, key: str, value: str) -> None:
        self._settings[key] = value


config = _Config()
# Other modules do: from config import config
# The underscore on _Config signals that only the instance is public.
