interface Command {
  execute(): void;
  undo(): void;
}

class TextEditor {
  private content = '';

  getContent(): string { return this.content; }

  insert(text: string, pos: number): void {
    this.content = this.content.slice(0, pos) + text + this.content.slice(pos);
  }

  delete(pos: number, len: number): void {
    this.content = this.content.slice(0, pos) + this.content.slice(pos + len);
  }
}

class InsertCommand implements Command {
  constructor(
    private editor: TextEditor,
    private text: string,
    private position: number,
  ) {}

  execute(): void { this.editor.insert(this.text, this.position); }
  undo(): void { this.editor.delete(this.position, this.text.length); }
}

class DeleteCommand implements Command {
  private deleted = '';

  constructor(
    private editor: TextEditor,
    private position: number,
    private length: number,
  ) {}

  execute(): void {
    const content = this.editor.getContent();
    this.deleted = content.slice(this.position, this.position + this.length);
    this.editor.delete(this.position, this.length);
  }

  undo(): void { this.editor.insert(this.deleted, this.position); }
}

class CommandHistory {
  private history: Command[] = [];
  private cursor = -1;

  execute(cmd: Command): void {
    this.history = this.history.slice(0, this.cursor + 1);
    cmd.execute();
    this.history.push(cmd);
    this.cursor++;
  }

  undo(): void {
    if (this.cursor < 0) return;
    this.history[this.cursor].undo();
    this.cursor--;
  }

  redo(): void {
    if (this.cursor >= this.history.length - 1) return;
    this.cursor++;
    this.history[this.cursor].execute();
  }
}

const editor = new TextEditor();
const history = new CommandHistory();

history.execute(new InsertCommand(editor, 'Hello, ', 0));
history.execute(new InsertCommand(editor, 'world', 7));
console.log(editor.getContent()); // Hello, world

history.undo();
console.log(editor.getContent()); // Hello,

history.redo();
console.log(editor.getContent()); // Hello, world

history.execute(new DeleteCommand(editor, 7, 5));
console.log(editor.getContent()); // Hello,
