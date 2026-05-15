// Prototype interface with a covariant return type
interface Cloneable {
  clone(): this;
}

// --- Concrete types ---

class TextDocument implements Cloneable {
  constructor(
    public title: string,
    public body: string,
    public tags: string[],
  ) {}

  clone(): this {
    // Shallow-copy the object, then deep-copy mutable fields
    const copy = Object.create(Object.getPrototypeOf(this)) as this;
    Object.assign(copy, this);
    copy.tags = [...this.tags]; // tags array is mutable, copy it
    return copy;
  }

  toString(): string {
    return `TextDocument("${this.title}", tags=[${this.tags.join(", ")}])`;
  }
}

class SpreadsheetDocument implements Cloneable {
  constructor(
    public title: string,
    public rows: number[][],
  ) {}

  clone(): this {
    const copy = Object.create(Object.getPrototypeOf(this)) as this;
    Object.assign(copy, this);
    copy.rows = this.rows.map((row) => [...row]); // deep-copy 2D array
    return copy;
  }

  toString(): string {
    return `SpreadsheetDocument("${this.title}", ${this.rows.length} rows)`;
  }
}

// --- Registry ---

class DocumentRegistry {
  private items = new Map<string, Cloneable>();

  register(key: string, prototype: Cloneable): void {
    this.items.set(key, prototype);
  }

  get<T extends Cloneable>(key: string): T {
    const proto = this.items.get(key);
    if (!proto) throw new Error(`No prototype registered for key "${key}"`);
    return proto.clone() as T;
  }
}

// --- Usage ---

const registry = new DocumentRegistry();

registry.register(
  "report",
  new TextDocument("Quarterly Report", "Summary goes here.", ["finance", "q1"]),
);

registry.register(
  "budget",
  new SpreadsheetDocument("Budget Template", [[0, 0, 0]]),
);

const doc1 = registry.get<TextDocument>("report");
doc1.title = "Q2 Report";
doc1.tags.push("q2");

const doc2 = registry.get<TextDocument>("report");
// doc2 still has the original title and tags -- the registry prototype is untouched

console.log(doc1.toString()); // TextDocument("Q2 Report", tags=[finance, q1, q2])
console.log(doc2.toString()); // TextDocument("Quarterly Report", tags=[finance, q1])
