class Editor {
  private content: string = '';
  private cursorPos: number = 0;

  // Snapshot is private to Editor: outsiders hold a reference but cannot read fields.
  private static Snapshot = class {
    constructor(
      readonly content: string,
      readonly cursorPos: number
    ) {}
  };

  type(text: string): void {
    this.content =
      this.content.slice(0, this.cursorPos) +
      text +
      this.content.slice(this.cursorPos);
    this.cursorPos += text.length;
  }

  moveCursor(pos: number): void {
    this.cursorPos = Math.max(0, Math.min(pos, this.content.length));
  }

  save(): InstanceType<typeof Editor.Snapshot> {
    return new Editor.Snapshot(this.content, this.cursorPos);
  }

  restore(snapshot: InstanceType<typeof Editor.Snapshot>): void {
    this.content = snapshot.content;
    this.cursorPos = snapshot.cursorPos;
  }

  toString(): string {
    return `"${this.content}" (cursor: ${this.cursorPos})`;
  }
}

class History {
  private stack: InstanceType<typeof (Editor as any)['Snapshot']>[] = [];

  push(snapshot: object): void {
    this.stack.push(snapshot as any);
  }

  pop(): object | undefined {
    return this.stack.pop();
  }
}

const editor = new Editor();
const history = new History();

history.push(editor.save());   // snapshot: "" cursor 0
editor.type('Hello');
history.push(editor.save());   // snapshot: "Hello" cursor 5
editor.type(', world');
console.log(editor.toString()); // "Hello, world" (cursor: 12)

const prev = history.pop();
if (prev) editor.restore(prev as any);
console.log(editor.toString()); // "Hello" (cursor: 5)

const initial = history.pop();
if (initial) editor.restore(initial as any);
console.log(editor.toString()); // "" (cursor: 0)
