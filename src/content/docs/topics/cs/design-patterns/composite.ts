interface FileSystemItem {
  getSize(): number;
  getName(): string;
}

class File implements FileSystemItem {
  constructor(private name: string, private size: number) {}

  getSize(): number {
    return this.size;
  }

  getName(): string {
    return this.name;
  }
}

class Directory implements FileSystemItem {
  private children: FileSystemItem[] = [];

  constructor(private name: string) {}

  add(item: FileSystemItem): void {
    this.children.push(item);
  }

  remove(item: FileSystemItem): void {
    this.children = this.children.filter((c) => c !== item);
  }

  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  getName(): string {
    return this.name;
  }
}

const root = new Directory('root');
const src = new Directory('src');
src.add(new File('index.ts', 1200));
src.add(new File('utils.ts', 800));

const assets = new Directory('assets');
assets.add(new File('logo.png', 45000));

root.add(src);
root.add(assets);
root.add(new File('README.md', 300));

console.log(root.getSize()); // 47300
console.log(src.getSize());  // 2000
