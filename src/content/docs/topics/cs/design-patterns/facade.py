class Projector:
    def on(self) -> None:  print('Projector on')
    def off(self) -> None: print('Projector off')
    def set_input(self, source: str) -> None: print(f'Projector input: {source}')

class SoundSystem:
    def on(self) -> None:  print('Sound system on')
    def off(self) -> None: print('Sound system off')
    def set_volume(self, level: int) -> None: print(f'Volume: {level}')

class StreamingPlayer:
    def on(self) -> None:   print('Streaming player on')
    def off(self) -> None:  print('Streaming player off')
    def play(self, title: str) -> None: print(f'Playing: {title}')
    def stop(self) -> None: print('Stopped')

class Lights:
    def dim(self, level: int) -> None: print(f'Lights dimmed to {level}%')
    def on(self) -> None: print('Lights on')


class HomeTheaterFacade:
    def __init__(
        self,
        projector: Projector,
        sound: SoundSystem,
        player: StreamingPlayer,
        lights: Lights,
    ) -> None:
        self._projector = projector
        self._sound = sound
        self._player = player
        self._lights = lights

    def watch_movie(self, title: str) -> None:
        self._lights.dim(10)
        self._projector.on()
        self._projector.set_input('HDMI')
        self._sound.on()
        self._sound.set_volume(40)
        self._player.on()
        self._player.play(title)

    def end_movie(self) -> None:
        self._player.stop()
        self._player.off()
        self._sound.off()
        self._projector.off()
        self._lights.on()


theater = HomeTheaterFacade(Projector(), SoundSystem(), StreamingPlayer(), Lights())
theater.watch_movie('The Matrix')
theater.end_movie()
