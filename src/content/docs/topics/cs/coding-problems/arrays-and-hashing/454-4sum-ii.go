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

func fourSumCount(nums1 []int, nums2 []int, nums3 []int, nums4 []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(fourSumCount([]int{1, 2}, []int{-2, -1}, []int{-1, 2}, []int{0, 2}) == 2, "test 1")
	assert(fourSumCount([]int{0}, []int{0}, []int{0}, []int{0}) == 1, "test 2")
	assert(fourSumCount([]int{-1, -1}, []int{-1, 1}, []int{-1, 1}, []int{1, -1}) == 6, "test 3")
	fmt.Println("all tests pass")
}

func main() { runTests() }
