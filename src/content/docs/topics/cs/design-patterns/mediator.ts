interface Mediator {
  register(user: User): void;
  send(sender: User, message: string): void;
}

class ChatRoom implements Mediator {
  private participants: User[] = [];

  register(user: User): void {
    this.participants.push(user);
    user.setMediator(this);
  }

  send(sender: User, message: string): void {
    for (const participant of this.participants) {
      if (participant !== sender) {
        participant.receive(sender.name, message);
      }
    }
  }
}

class User {
  private mediator: Mediator | null = null;

  constructor(public readonly name: string) {}

  setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }

  send(message: string): void {
    console.log(`${this.name} sends: "${message}"`);
    this.mediator?.send(this, message);
  }

  receive(from: string, message: string): void {
    console.log(`${this.name} receives from ${from}: "${message}"`);
  }
}

const room = new ChatRoom();
const alice = new User('Alice');
const bob = new User('Bob');
const carol = new User('Carol');

room.register(alice);
room.register(bob);
room.register(carol);

alice.send('Hello, everyone!');
// Alice sends: "Hello, everyone!"
// Bob receives from Alice: "Hello, everyone!"
// Carol receives from Alice: "Hello, everyone!"
