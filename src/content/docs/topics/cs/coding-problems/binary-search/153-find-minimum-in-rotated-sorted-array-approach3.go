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

func findMin(nums []int) int {
	lo, hi := 0, len(nums)-1
	for lo < hi {
		mid := (lo + hi) / 2
		if nums[mid] > nums[hi] {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return nums[lo]
}

func runTests() {
	assert(findMin([]int{3, 4, 5, 1, 2}) == 1)
	assert(findMin([]int{4, 5, 6, 7, 0, 1, 2}) == 0)
	assert(findMin([]int{11, 13, 15, 17}) == 11)
	assert(findMin([]int{1}) == 1)
	assert(findMin([]int{2, 1}) == 1)
	assert(findMin([]int{1, 2}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
