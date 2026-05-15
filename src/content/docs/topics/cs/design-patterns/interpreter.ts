type Context = Map<string, boolean>;

interface AbstractExpression {
  interpret(context: Context): boolean;
}

class Variable implements AbstractExpression {
  constructor(private name: string) {}
  interpret(context: Context): boolean {
    return context.get(this.name) ?? false;
  }
}

class AndExpression implements AbstractExpression {
  constructor(
    private left: AbstractExpression,
    private right: AbstractExpression
  ) {}
  interpret(context: Context): boolean {
    return this.left.interpret(context) && this.right.interpret(context);
  }
}

class OrExpression implements AbstractExpression {
  constructor(
    private left: AbstractExpression,
    private right: AbstractExpression
  ) {}
  interpret(context: Context): boolean {
    return this.left.interpret(context) || this.right.interpret(context);
  }
}

class NotExpression implements AbstractExpression {
  constructor(private operand: AbstractExpression) {}
  interpret(context: Context): boolean {
    return !this.operand.interpret(context);
  }
}

// (x AND y) OR (NOT z)
const x = new Variable('x');
const y = new Variable('y');
const z = new Variable('z');
const expr = new OrExpression(
  new AndExpression(x, y),
  new NotExpression(z)
);

const ctx: Context = new Map([['x', true], ['y', false], ['z', false]]);
console.log(expr.interpret(ctx)); // true  (NOT z is true)

const ctx2: Context = new Map([['x', true], ['y', true], ['z', true]]);
console.log(expr.interpret(ctx2)); // true  (x AND y is true)
