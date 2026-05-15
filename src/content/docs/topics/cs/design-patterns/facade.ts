class Projector {
  on(): void  { console.log('Projector on'); }
  off(): void { console.log('Projector off'); }
  setInput(input: string): void { console.log(`Projector input: ${input}`); }
}

class SoundSystem {
  on(): void  { console.log('Sound system on'); }
  off(): void { console.log('Sound system off'); }
  setVolume(level: number): void { console.log(`Volume: ${level}`); }
}

class StreamingPlayer {
  on(): void  { console.log('Streaming player on'); }
  off(): void { console.log('Streaming player off'); }
  play(title: string): void { console.log(`Playing: ${title}`); }
  stop(): void { console.log('Stopped'); }
}

class Lights {
  dim(level: number): void { console.log(`Lights dimmed to ${level}%`); }
  on(): void { console.log('Lights on'); }
}

class HomeTheaterFacade {
  constructor(
    private projector: Projector,
    private sound: SoundSystem,
    private player: StreamingPlayer,
    private lights: Lights,
  ) {}

  watchMovie(title: string): void {
    this.lights.dim(10);
    this.projector.on();
    this.projector.setInput('HDMI');
    this.sound.on();
    this.sound.setVolume(40);
    this.player.on();
    this.player.play(title);
  }

  endMovie(): void {
    this.player.stop();
    this.player.off();
    this.sound.off();
    this.projector.off();
    this.lights.on();
  }
}

const theater = new HomeTheaterFacade(
  new Projector(),
  new SoundSystem(),
  new StreamingPlayer(),
  new Lights(),
);

theater.watchMovie('The Matrix');
// Lights dimmed to 10%
// Projector on
// Projector input: HDMI
// Sound system on
// Volume: 40
// Streaming player on
// Playing: The Matrix

theater.endMovie();
// Stopped
// Streaming player off
// Sound system off
// Projector off
// Lights on
