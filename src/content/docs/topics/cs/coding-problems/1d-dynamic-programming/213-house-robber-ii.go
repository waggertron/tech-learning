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

func rob(nums []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(rob([]int{2, 3, 2}) == 3)
	assert(rob([]int{1, 2, 3, 1}) == 4)
	assert(rob([]int{1, 2, 3}) == 3)
	assert(rob([]int{5}) == 5)
	assert(rob([]int{1, 3}) == 3)
	assert(rob([]int{2, 7, 9, 3, 1}) == 11)
	fmt.Println("all tests pass")
}

func main() { runTests() }
