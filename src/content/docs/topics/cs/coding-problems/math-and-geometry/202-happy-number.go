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

func isHappy(n int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(isHappy(19) == true)
	assert(isHappy(2) == false)
	assert(isHappy(1) == true)
	assert(isHappy(7) == true)
	assert(isHappy(4) == false)
	assert(isHappy(100) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
