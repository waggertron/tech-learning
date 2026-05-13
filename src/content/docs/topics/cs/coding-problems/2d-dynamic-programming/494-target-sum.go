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

func findTargetSumWays(nums []int, target int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(findTargetSumWays([]int{1, 1, 1, 1, 1}, 3) == 5)
	assert(findTargetSumWays([]int{1}, 1) == 1)
	assert(findTargetSumWays([]int{1, 1}, 0) == 2)
	assert(findTargetSumWays([]int{1, 2}, 4) == 0)
	assert(findTargetSumWays([]int{1}, -1) == 1)
	assert(findTargetSumWays([]int{0, 0, 0}, 0) == 8)
	fmt.Println("all tests pass")
}

func main() { runTests() }
