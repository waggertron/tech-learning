package main

import "fmt"

type Context map[string]bool

type Expression interface {
	Interpret(ctx Context) bool
}

type Variable struct{ Name string }

func (v *Variable) Interpret(ctx Context) bool {
	return ctx[v.Name]
}

type AndExpression struct{ Left, Right Expression }

func (a *AndExpression) Interpret(ctx Context) bool {
	return a.Left.Interpret(ctx) && a.Right.Interpret(ctx)
}

type OrExpression struct{ Left, Right Expression }

func (o *OrExpression) Interpret(ctx Context) bool {
	return o.Left.Interpret(ctx) || o.Right.Interpret(ctx)
}

type NotExpression struct{ Operand Expression }

func (n *NotExpression) Interpret(ctx Context) bool {
	return !n.Operand.Interpret(ctx)
}

func main() {
	// (x AND y) OR (NOT z)
	x, y, z := &Variable{"x"}, &Variable{"y"}, &Variable{"z"}
	expr := &OrExpression{
		Left:  &AndExpression{Left: x, Right: y},
		Right: &NotExpression{Operand: z},
	}

	ctx := Context{"x": true, "y": false, "z": false}
	fmt.Println(expr.Interpret(ctx)) // true  (NOT z is true)

	ctx2 := Context{"x": true, "y": true, "z": true}
	fmt.Println(expr.Interpret(ctx2)) // true  (x AND y is true)
}
