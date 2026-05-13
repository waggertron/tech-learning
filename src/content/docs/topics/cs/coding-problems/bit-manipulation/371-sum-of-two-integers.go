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

func getSum(a int, b int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(getSum(1, 2) == 3)
	assert(getSum(2, 3) == 5)
	assert(getSum(0, 0) == 0)
	assert(getSum(-1, 1) == 0)
	assert(getSum(-5, 3) == -2)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
