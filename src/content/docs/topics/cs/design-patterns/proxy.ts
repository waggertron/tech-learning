interface Image {
  display(): void;
}

class RealImage implements Image {
  private data: string;

  constructor(private filename: string) {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): string {
    console.log(`Loading ${this.filename} from disk...`);
    return `<image data for ${this.filename}>`;
  }

  display(): void {
    console.log(`Displaying ${this.filename}: ${this.data}`);
  }
}

class ImageProxy implements Image {
  private realImage: RealImage | null = null;

  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// With RealImage, disk load happens at construction time.
// With ImageProxy, disk load is deferred until display() is called.
const image = new ImageProxy('photo.jpg');
console.log('Proxy created, no disk access yet');

image.display(); // loads now
// Loading photo.jpg from disk...
// Displaying photo.jpg: <image data for photo.jpg>

image.display(); // uses cached RealImage
// Displaying photo.jpg: <image data for photo.jpg>

// --- Protection proxy ---

interface UserService {
  getUser(id: string): string;
  deleteUser(id: string): void;
}

class RealUserService implements UserService {
  getUser(id: string): string { return `User ${id}`; }
  deleteUser(id: string): void { console.log(`Deleted user ${id}`); }
}

class AuthUserServiceProxy implements UserService {
  constructor(
    private service: RealUserService,
    private role: string,
  ) {}

  getUser(id: string): string {
    return this.service.getUser(id);
  }

  deleteUser(id: string): void {
    if (this.role !== 'admin') {
      throw new Error('Permission denied: admin role required');
    }
    this.service.deleteUser(id);
  }
}

const adminProxy = new AuthUserServiceProxy(new RealUserService(), 'admin');
adminProxy.deleteUser('42'); // Deleted user 42

const userProxy = new AuthUserServiceProxy(new RealUserService(), 'user');
try {
  userProxy.deleteUser('42');
} catch (e) {
  console.log((e as Error).message); // Permission denied: admin role required
}
