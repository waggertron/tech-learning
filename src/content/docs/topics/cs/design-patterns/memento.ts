class Editor {
  private content: string = '';
  private cursorPos: number = 0;
  private static snapshots = new WeakMap<object, { content: string; cursorPos: number }>();

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

  save(): object {
    const snapshot = {};
    Editor.snapshots.set(snapshot, {
      content: this.content,
      cursorPos: this.cursorPos,
    });
    return snapshot;
  }

  restore(snapshot: object): void {
    const state = Editor.snapshots.get(snapshot);
    if (!state) {
      throw new Error('Unknown editor snapshot');
    }

    this.content = state.content;
    this.cursorPos = state.cursorPos;
  }

  toString(): string {
    return `"${this.content}" (cursor: ${this.cursorPos})`;
  }
}

class History {
  private stack: object[] = [];

  push(snapshot: object): void {
    this.stack.push(snapshot);
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
if (prev) editor.restore(prev);
console.log(editor.toString()); // "Hello" (cursor: 5)

const initial = history.pop();
if (initial) editor.restore(initial);
console.log(editor.toString()); // "" (cursor: 0)
