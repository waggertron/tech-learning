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

func trap(height []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(trap([]int{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}) == 6)
	assert(trap([]int{4, 2, 0, 3, 2, 5}) == 9)
	assert(trap([]int{}) == 0)
	assert(trap([]int{3}) == 0)
	assert(trap([]int{3, 0, 3}) == 3)
	assert(trap([]int{1, 0, 1}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
