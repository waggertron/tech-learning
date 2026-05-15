interface TrafficLightState {
  next(context: TrafficLight): void;
  getColor(): string;
}

class RedState implements TrafficLightState {
  next(context: TrafficLight): void {
    context.setState(new GreenState());
  }
  getColor(): string {
    return 'Red';
  }
}

class GreenState implements TrafficLightState {
  next(context: TrafficLight): void {
    context.setState(new YellowState());
  }
  getColor(): string {
    return 'Green';
  }
}

class YellowState implements TrafficLightState {
  next(context: TrafficLight): void {
    context.setState(new RedState());
  }
  getColor(): string {
    return 'Yellow';
  }
}

class TrafficLight {
  constructor(private state: TrafficLightState = new RedState()) {}

  setState(state: TrafficLightState): void {
    this.state = state;
  }

  next(): void {
    this.state.next(this);
  }

  getColor(): string {
    return this.state.getColor();
  }
}

const light = new TrafficLight();
console.log(light.getColor()); // Red
light.next();
console.log(light.getColor()); // Green
light.next();
console.log(light.getColor()); // Yellow
light.next();
console.log(light.getColor()); // Red
