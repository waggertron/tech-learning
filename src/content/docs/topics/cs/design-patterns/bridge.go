package main

import "fmt"

// Device is the implementation interface.
type Device interface {
    IsEnabled() bool
    Enable()
    Disable()
    GetVolume() int
    SetVolume(percent int)
    GetChannel() int
    SetChannel(channel int)
}

// TV is a concrete Device.
type TV struct {
    on      bool
    volume  int
    channel int
}

func NewTV() *TV { return &TV{volume: 30, channel: 1} }

func (t *TV) IsEnabled() bool { return t.on }
func (t *TV) Enable()         { t.on = true; fmt.Println("TV: powered on") }
func (t *TV) Disable()        { t.on = false; fmt.Println("TV: powered off") }
func (t *TV) GetVolume() int  { return t.volume }
func (t *TV) SetVolume(percent int) {
    if percent < 0 { percent = 0 }
    if percent > 100 { percent = 100 }
    t.volume = percent
    fmt.Printf("TV: volume set to %d\n", t.volume)
}
func (t *TV) GetChannel() int { return t.channel }
func (t *TV) SetChannel(channel int) {
    t.channel = channel
    fmt.Printf("TV: channel set to %d\n", t.channel)
}

// Radio is a concrete Device.
type Radio struct {
    on      bool
    volume  int
    channel int
}

func NewRadio() *Radio { return &Radio{volume: 50, channel: 1} }

func (r *Radio) IsEnabled() bool { return r.on }
func (r *Radio) Enable()         { r.on = true; fmt.Println("Radio: powered on") }
func (r *Radio) Disable()        { r.on = false; fmt.Println("Radio: powered off") }
func (r *Radio) GetVolume() int  { return r.volume }
func (r *Radio) SetVolume(percent int) {
    if percent < 0 { percent = 0 }
    if percent > 100 { percent = 100 }
    r.volume = percent
    fmt.Printf("Radio: volume set to %d\n", r.volume)
}
func (r *Radio) GetChannel() int { return r.channel }
func (r *Radio) SetChannel(channel int) {
    r.channel = channel
    fmt.Printf("Radio: channel set to %d\n", r.channel)
}

// RemoteControl is the abstraction. It holds the bridge to the Device.
type RemoteControl struct {
    device Device
}

func (rc *RemoteControl) TogglePower() {
    if rc.device.IsEnabled() {
        rc.device.Disable()
    } else {
        rc.device.Enable()
    }
}

func (rc *RemoteControl) VolumeDown() {
    rc.device.SetVolume(rc.device.GetVolume() - 10)
}

func (rc *RemoteControl) VolumeUp() {
    rc.device.SetVolume(rc.device.GetVolume() + 10)
}

func (rc *RemoteControl) ChannelDown() {
    rc.device.SetChannel(rc.device.GetChannel() - 1)
}

func (rc *RemoteControl) ChannelUp() {
    rc.device.SetChannel(rc.device.GetChannel() + 1)
}

// BasicRemote embeds RemoteControl and adds nothing.
type BasicRemote struct {
    RemoteControl
}

func NewBasicRemote(d Device) *BasicRemote {
    return &BasicRemote{RemoteControl{device: d}}
}

// AdvancedRemote embeds RemoteControl and adds Mute.
type AdvancedRemote struct {
    RemoteControl
}

func NewAdvancedRemote(d Device) *AdvancedRemote {
    return &AdvancedRemote{RemoteControl{device: d}}
}

func (ar *AdvancedRemote) Mute() {
    fmt.Println("AdvancedRemote: muting device")
    ar.device.SetVolume(0)
}

func main() {
    tv := NewTV()
    radio := NewRadio()

    basic := NewBasicRemote(tv)
    basic.TogglePower() // TV: powered on
    basic.VolumeUp()    // TV: volume set to 40

    advanced := NewAdvancedRemote(radio)
    advanced.TogglePower() // Radio: powered on
    advanced.Mute()         // Radio: volume set to 0

    // Same remote type, different device: no class changes required.
    tvAdvanced := NewAdvancedRemote(tv)
    tvAdvanced.Mute() // TV: volume set to 0
}
