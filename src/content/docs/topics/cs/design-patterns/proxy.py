from __future__ import annotations
from abc import ABC, abstractmethod


class Image(ABC):
    @abstractmethod
    def display(self) -> None: ...


class RealImage(Image):
    def __init__(self, filename: str) -> None:
        self._filename = filename
        self._data = self._load_from_disk()

    def _load_from_disk(self) -> str:
        print(f'Loading {self._filename} from disk...')
        return f'<image data for {self._filename}>'

    def display(self) -> None:
        print(f'Displaying {self._filename}: {self._data}')


class ImageProxy(Image):
    def __init__(self, filename: str) -> None:
        self._filename = filename
        self._real_image: RealImage | None = None

    def display(self) -> None:
        if self._real_image is None:
            self._real_image = RealImage(self._filename)
        self._real_image.display()


image = ImageProxy('photo.jpg')
print('Proxy created, no disk access yet')

image.display()  # loads now
# Loading photo.jpg from disk...
# Displaying photo.jpg: <image data for photo.jpg>

image.display()  # uses cached instance
# Displaying photo.jpg: <image data for photo.jpg>
