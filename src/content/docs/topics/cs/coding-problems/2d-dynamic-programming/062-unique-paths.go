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

func uniquePaths(m int, n int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(uniquePaths(3, 7) == 28)
	assert(uniquePaths(3, 2) == 3)
	assert(uniquePaths(1, 1) == 1)
	assert(uniquePaths(1, 5) == 1)
	assert(uniquePaths(5, 1) == 1)
	assert(uniquePaths(3, 3) == 6)
	fmt.Println("all tests pass")
}

func main() { runTests() }
