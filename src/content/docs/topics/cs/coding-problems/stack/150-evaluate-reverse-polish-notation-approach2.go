package main

import (
	"fmt"
	"strconv"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func evalRPN(tokens []string) int {
	stack := []int{}
	for _, tok := range tokens {
		switch tok {
		case "+", "-", "*", "/":
			b := stack[len(stack)-1]
			a := stack[len(stack)-2]
			stack = stack[:len(stack)-2]
			var res int
			switch tok {
			case "+":
				res = a + b
			case "-":
				res = a - b
			case "*":
				res = a * b
			case "/":
				res = int(float64(a) / float64(b)) // truncate toward zero
			}
			stack = append(stack, res)
		default:
			n, _ := strconv.Atoi(tok)
			stack = append(stack, n)
		}
	}
	return stack[0]
}

func runTests() {
	assert(evalRPN([]string{"2", "1", "+", "3", "*"}) == 9)
	assert(evalRPN([]string{"4", "13", "5", "/", "+"}) == 6)
	assert(evalRPN([]string{"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}) == 22)
	assert(evalRPN([]string{"3"}) == 3)
	assert(evalRPN([]string{"6", "2", "/"}) == 3)
	assert(evalRPN([]string{"7", "2", "/"}) == 3)
	assert(evalRPN([]string{"-7", "2", "/"}) == -3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
