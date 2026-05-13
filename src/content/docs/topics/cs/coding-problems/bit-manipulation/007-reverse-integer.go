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

func reverse(x int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(reverse(123) == 321)
	assert(reverse(-123) == -321)
	assert(reverse(120) == 21)
	assert(reverse(0) == 0)
	assert(reverse(1<<31-1) == 0)
	assert(reverse(1534236469) == 0)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
