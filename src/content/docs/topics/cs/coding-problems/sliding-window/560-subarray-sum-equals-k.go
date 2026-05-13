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

func subarraySum(nums []int, k int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(subarraySum([]int{1, 1, 1}, 2) == 2)
	assert(subarraySum([]int{1, 2, 3}, 3) == 2)
	assert(subarraySum([]int{1}, 0) == 0)
	assert(subarraySum([]int{1}, 1) == 1)
	assert(subarraySum([]int{-1, -1, 1}, 0) == 1)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
