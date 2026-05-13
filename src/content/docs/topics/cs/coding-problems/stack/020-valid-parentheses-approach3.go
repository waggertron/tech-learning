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

func isValid(s string) bool {
	pairs := map[byte]byte{')': '(', ']': '[', '}': '{'}
	stack := []byte{}
	for i := 0; i < len(s); i++ {
		ch := s[i]
		if ch == '(' || ch == '[' || ch == '{' {
			stack = append(stack, ch)
		} else {
			if len(stack) == 0 || stack[len(stack)-1] != pairs[ch] {
				return false
			}
			stack = stack[:len(stack)-1]
		}
	}
	return len(stack) == 0
}

func runTests() {
	assert(isValid("()") == true)
	assert(isValid("()[]{}") == true)
	assert(isValid("(]") == false)
	assert(isValid("([)]") == false)
	assert(isValid("{[]}") == true)
	assert(isValid("") == true)
	assert(isValid("(") == false)
	assert(isValid(")") == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
