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
	// TODO: implement
	return false
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
