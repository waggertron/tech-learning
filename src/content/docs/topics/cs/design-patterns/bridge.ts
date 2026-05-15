// Device interface (implementation side)
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(percent: number): void;
  getChannel(): number;
  setChannel(channel: number): void;
}

// Concrete implementations
class TV implements Device {
  private on = false;
  private volume = 30;
  private channel = 1;

  isEnabled() { return this.on; }
  enable() { this.on = true; console.log("TV: powered on"); }
  disable() { this.on = false; console.log("TV: powered off"); }
  getVolume() { return this.volume; }
  setVolume(percent: number) {
    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`TV: volume set to ${this.volume}`);
  }
  getChannel() { return this.channel; }
  setChannel(channel: number) {
    this.channel = channel;
    console.log(`TV: channel set to ${this.channel}`);
  }
}

class Radio implements Device {
  private on = false;
  private volume = 50;
  private channel = 1;

  isEnabled() { return this.on; }
  enable() { this.on = true; console.log("Radio: powered on"); }
  disable() { this.on = false; console.log("Radio: powered off"); }
  getVolume() { return this.volume; }
  setVolume(percent: number) {
    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`Radio: volume set to ${this.volume}`);
  }
  getChannel() { return this.channel; }
  setChannel(channel: number) {
    this.channel = channel;
    console.log(`Radio: channel set to ${this.channel}`);
  }
}

// Abstraction side
abstract class RemoteControl {
  protected device: Device;

  constructor(device: Device) {
    this.device = device;
  }

  togglePower() {
    if (this.device.isEnabled()) {
      this.device.disable();
    } else {
      this.device.enable();
    }
  }

  volumeDown() { this.device.setVolume(this.device.getVolume() - 10); }
  volumeUp()   { this.device.setVolume(this.device.getVolume() + 10); }
  channelDown() { this.device.setChannel(this.device.getChannel() - 1); }
  channelUp()   { this.device.setChannel(this.device.getChannel() + 1); }
}

class BasicRemote extends RemoteControl {
  // Inherits all methods from RemoteControl; no additions.
}

class AdvancedRemote extends RemoteControl {
  mute() {
    console.log("AdvancedRemote: muting device");
    this.device.setVolume(0);
  }
}

// Usage
const tv = new TV();
const radio = new Radio();

const basicRemote = new BasicRemote(tv);
basicRemote.togglePower();  // TV: powered on
basicRemote.volumeUp();     // TV: volume set to 40

const advancedRemote = new AdvancedRemote(radio);
advancedRemote.togglePower(); // Radio: powered on
advancedRemote.mute();        // Radio: volume set to 0

// Swap the device without changing the remote class
const tvAdvancedRemote = new AdvancedRemote(tv);
tvAdvancedRemote.mute(); // TV: volume set to 0
