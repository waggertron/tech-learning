package main

import "fmt"

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

type frame struct {
	result int
	sign   int
}

func calculate(s string) int {
	stack := []frame{}
	result := 0
	sign := 1
	num := 0

	for _, ch := range s {
		switch {
		case ch >= '0' && ch <= '9':
			num = num*10 + int(ch-'0')
		case ch == '+' || ch == '-':
			result += sign * num
			num = 0
			if ch == '+' {
				sign = 1
			} else {
				sign = -1
			}
		case ch == '(':
			stack = append(stack, frame{result, sign})
			result = 0
			sign = 1
			num = 0
		case ch == ')':
			result += sign * num
			num = 0
			prev := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			result = prev.result + prev.sign*result
		}
	}
	return result + sign*num
}

func runTests() {
	assert(calculate("1 + 1") == 2)
	assert(calculate(" 2-1 + 2 ") == 3)
	assert(calculate("(1+(4+5+2)-3)+(6+8)") == 23)
	assert(calculate("1-(     -2)") == 3)
	assert(calculate("- (3 + (4 + 5))") == -12)
	fmt.Println("all tests pass")
}

func main() { runTests() }
