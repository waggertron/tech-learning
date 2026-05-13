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

func calculate(s string) int {
	// TODO: implement
	return 0
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
