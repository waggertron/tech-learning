interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  constructor(private address: string) {}
  send(message: string): void {
    console.log(`Email to ${this.address}: ${message}`);
  }
}

class SMSNotification implements Notification {
  constructor(private phone: string) {}
  send(message: string): void {
    console.log(`SMS to ${this.phone}: ${message}`);
  }
}

class PushNotification implements Notification {
  constructor(private deviceId: string) {}
  send(message: string): void {
    console.log(`Push to device ${this.deviceId}: ${message}`);
  }
}

// Simple factory function (not GoF, but common)
function createNotification(
  type: 'email' | 'sms' | 'push',
  destination: string
): Notification {
  switch (type) {
    case 'email': return new EmailNotification(destination);
    case 'sms':   return new SMSNotification(destination);
    case 'push':  return new PushNotification(destination);
  }
}

// GoF Factory Method: abstract creator with a factory method
abstract class NotificationService {
  protected abstract createNotification(destination: string): Notification;

  notify(destination: string, message: string): void {
    const notification = this.createNotification(destination);
    notification.send(message);
  }
}

class EmailService extends NotificationService {
  protected createNotification(email: string): Notification {
    return new EmailNotification(email);
  }
}

class SMSService extends NotificationService {
  protected createNotification(phone: string): Notification {
    return new SMSNotification(phone);
  }
}

// Usage
const n = createNotification('email', 'user@example.com');
n.send('Your order shipped');
// Email to user@example.com: Your order shipped

const service = new EmailService();
service.notify('admin@example.com', 'Server alert');
// Email to admin@example.com: Server alert
