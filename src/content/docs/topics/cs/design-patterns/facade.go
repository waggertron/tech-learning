package main

import "fmt"

type Projector struct{}
func (p *Projector) On()               { fmt.Println("Projector on") }
func (p *Projector) Off()              { fmt.Println("Projector off") }
func (p *Projector) SetInput(s string) { fmt.Printf("Projector input: %s\n", s) }

type SoundSystem struct{}
func (s *SoundSystem) On()             { fmt.Println("Sound system on") }
func (s *SoundSystem) Off()            { fmt.Println("Sound system off") }
func (s *SoundSystem) SetVolume(n int) { fmt.Printf("Volume: %d\n", n) }

type StreamingPlayer struct{}
func (p *StreamingPlayer) On()               { fmt.Println("Streaming player on") }
func (p *StreamingPlayer) Off()              { fmt.Println("Streaming player off") }
func (p *StreamingPlayer) Play(title string) { fmt.Printf("Playing: %s\n", title) }
func (p *StreamingPlayer) Stop()             { fmt.Println("Stopped") }

type Lights struct{}
func (l *Lights) Dim(level int) { fmt.Printf("Lights dimmed to %d%%\n", level) }
func (l *Lights) On()           { fmt.Println("Lights on") }

type HomeTheaterFacade struct {
	projector *Projector
	sound     *SoundSystem
	player    *StreamingPlayer
	lights    *Lights
}

func (f *HomeTheaterFacade) WatchMovie(title string) {
	f.lights.Dim(10)
	f.projector.On()
	f.projector.SetInput("HDMI")
	f.sound.On()
	f.sound.SetVolume(40)
	f.player.On()
	f.player.Play(title)
}

func (f *HomeTheaterFacade) EndMovie() {
	f.player.Stop()
	f.player.Off()
	f.sound.Off()
	f.projector.Off()
	f.lights.On()
}

func main() {
	theater := &HomeTheaterFacade{
		projector: &Projector{},
		sound:     &SoundSystem{},
		player:    &StreamingPlayer{},
		lights:    &Lights{},
	}
	theater.WatchMovie("The Matrix")
	theater.EndMovie()
}
