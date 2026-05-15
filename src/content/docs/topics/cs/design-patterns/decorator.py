from __future__ import annotations
from abc import ABC, abstractmethod


class DataService(ABC):
    @abstractmethod
    def fetch_data(self, key: str) -> str: ...


class RealDataService(DataService):
    def fetch_data(self, key: str) -> str:
        print(f'  [DB] Fetching key: {key}')
        return f'value_for_{key}'


class LoggerDecorator(DataService):
    def __init__(self, wrapped: DataService) -> None:
        self._wrapped = wrapped

    def fetch_data(self, key: str) -> str:
        print(f'[LOG] fetch_data called with key="{key}"')
        result = self._wrapped.fetch_data(key)
        print(f'[LOG] fetch_data returned "{result}"')
        return result


class CacheDecorator(DataService):
    def __init__(self, wrapped: DataService) -> None:
        self._wrapped = wrapped
        self._cache: dict[str, str] = {}

    def fetch_data(self, key: str) -> str:
        if key in self._cache:
            print(f'[CACHE] hit for "{key}"')
            return self._cache[key]
        result = self._wrapped.fetch_data(key)
        self._cache[key] = result
        print(f'[CACHE] stored "{key}"')
        return result


service: DataService = CacheDecorator(LoggerDecorator(RealDataService()))

print('--- First call ---')
service.fetch_data('user:42')

print('--- Second call ---')
service.fetch_data('user:42')
