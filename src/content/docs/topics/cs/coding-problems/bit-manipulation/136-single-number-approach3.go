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

func singleNumber(nums []int) int {
	result := 0                        // L1: O(1)
	for _, x := range nums {           // L2: single pass, n iterations
		result ^= x                    // L3: O(1), XOR accumulate
	}
	return result
}

func main() {
	assert(singleNumber([]int{2, 2, 1}) == 1)
	assert(singleNumber([]int{4, 1, 2, 1, 2}) == 4)
	assert(singleNumber([]int{1}) == 1)
	assert(singleNumber([]int{0, 0, 99}) == 99)
	assert(singleNumber([]int{-1, -1, 42}) == 42)
	fmt.Println("all tests pass")
}
