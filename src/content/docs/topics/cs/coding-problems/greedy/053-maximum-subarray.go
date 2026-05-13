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

func maxSubArray(nums []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(maxSubArray([]int{-2, 1, -3, 4, -1, 2, 1, -5, 4}) == 6)
	assert(maxSubArray([]int{1}) == 1)
	assert(maxSubArray([]int{5, 4, -1, 7, 8}) == 23)
	assert(maxSubArray([]int{-1}) == -1)
	assert(maxSubArray([]int{-2, -3, -1, -5}) == -1)
	assert(maxSubArray([]int{1, 2, 3, 4, 5}) == 15)
	fmt.Println("all tests pass")
}

func main() { runTests() }
