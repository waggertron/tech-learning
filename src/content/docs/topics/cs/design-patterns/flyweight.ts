class TreeType {
  constructor(
    readonly name: string,
    readonly color: string,
    readonly texture: string,
  ) {}

  draw(x: number, y: number): void {
    console.log(
      `Drawing ${this.name} (${this.color}) at (${x}, ${y}) [texture: ${this.texture}]`
    );
  }
}

class TreeTypeFactory {
  private static types = new Map<string, TreeType>();

  static getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}|${color}|${texture}`;
    if (!this.types.has(key)) {
      this.types.set(key, new TreeType(name, color, texture));
    }
    return this.types.get(key)!;
  }

  static count(): number { return this.types.size; }
}

class Tree {
  constructor(
    private x: number,
    private y: number,
    private type: TreeType,
  ) {}

  draw(): void { this.type.draw(this.x, this.y); }
}

class Forest {
  private trees: Tree[] = [];

  plantTree(x: number, y: number, name: string, color: string, texture: string): void {
    const type = TreeTypeFactory.getTreeType(name, color, texture);
    this.trees.push(new Tree(x, y, type));
  }

  draw(): void { this.trees.forEach(t => t.draw()); }
}

const forest = new Forest();
forest.plantTree(10, 20, 'Oak', 'dark green', 'rough');
forest.plantTree(30, 40, 'Oak', 'dark green', 'rough');   // reuses existing TreeType
forest.plantTree(50, 60, 'Pine', 'light green', 'smooth');
forest.plantTree(70, 80, 'Oak', 'dark green', 'rough');   // reuses existing TreeType

forest.draw();
console.log(`TreeType instances: ${TreeTypeFactory.count()}`); // 2, not 4
