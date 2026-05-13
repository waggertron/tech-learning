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

func checkValidString(s string) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(checkValidString("()") == true)
	assert(checkValidString("(*)") == true)
	assert(checkValidString("(*))") == true)
	assert(checkValidString("((") == false)
	assert(checkValidString("*") == true)
	assert(checkValidString("(*") == true)
	assert(checkValidString(")") == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
