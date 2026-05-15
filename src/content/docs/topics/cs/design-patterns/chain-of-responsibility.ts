interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}

abstract class BaseHandler implements Handler {
  private next: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler;
  }

  handle(request: string): string | null {
    if (this.next) {
      return this.next.handle(request);
    }
    return null;
  }
}

class Level1Support extends BaseHandler {
  handle(request: string): string | null {
    if (request === 'password-reset') {
      return 'Level 1 resolved: password reset';
    }
    return super.handle(request);
  }
}

class Level2Support extends BaseHandler {
  handle(request: string): string | null {
    if (request === 'billing-dispute') {
      return 'Level 2 resolved: billing dispute';
    }
    return super.handle(request);
  }
}

class Level3Support extends BaseHandler {
  handle(request: string): string | null {
    if (request === 'data-corruption') {
      return 'Level 3 resolved: data corruption';
    }
    return super.handle(request);
  }
}

const l1 = new Level1Support();
const l2 = new Level2Support();
const l3 = new Level3Support();
l1.setNext(l2).setNext(l3);

console.log(l1.handle('password-reset'));   // Level 1 resolved: password reset
console.log(l1.handle('billing-dispute'));  // Level 2 resolved: billing dispute
console.log(l1.handle('data-corruption'));  // Level 3 resolved: data corruption
console.log(l1.handle('unknown'));          // null
