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

func missingNumber(nums []int) int {
	result := len(nums)                    // L1: O(1), start with n
	for i, x := range nums {              // L2: single pass, n iterations
		result ^= i ^ x                   // L3: O(1), cancel paired values
	}
	return result
}

func main() {
	assert(missingNumber([]int{3, 0, 1}) == 2)
	assert(missingNumber([]int{0, 1}) == 2)
	assert(missingNumber([]int{9, 6, 4, 2, 3, 5, 7, 0, 1}) == 8)
	assert(missingNumber([]int{0}) == 1)
	assert(missingNumber([]int{1}) == 0)
	assert(missingNumber([]int{0, 1, 2, 4, 5}) == 3)
	fmt.Println("all tests pass")
}
