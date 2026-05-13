package main

import (
	"fmt"
	"sort"
)

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
	sort.Ints(nums)                             // L1: O(n log n)
	for i := 0; i < len(nums)-1; i += 2 {      // L2: scan in steps of 2
		if nums[i] != nums[i+1] {              // L3: O(1)
			return nums[i]
		}
	}
	return nums[len(nums)-1]                    // L4: last element is single
}

func main() {
	assert(singleNumber([]int{2, 2, 1}) == 1)
	assert(singleNumber([]int{4, 1, 2, 1, 2}) == 4)
	assert(singleNumber([]int{1}) == 1)
	assert(singleNumber([]int{0, 0, 99}) == 99)
	assert(singleNumber([]int{-1, -1, 42}) == 42)
	fmt.Println("all tests pass")
}
