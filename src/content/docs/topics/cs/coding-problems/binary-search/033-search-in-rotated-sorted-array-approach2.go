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

func search(nums []int, target int) int {
	// Step 1: find rotation pivot (index of min)
	lo, hi := 0, len(nums)-1
	for lo < hi {
		mid := (lo + hi) / 2
		if nums[mid] > nums[hi] {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	pivot := lo
	// Step 2: pick which half to binary-search
	if pivot == 0 || target < nums[0] {
		lo, hi = pivot, len(nums)-1
	} else {
		lo, hi = 0, pivot-1
	}
	for lo <= hi {
		mid := (lo + hi) / 2
		if nums[mid] == target {
			return mid
		}
		if nums[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return -1
}

func runTests() {
	assert(search([]int{4, 5, 6, 7, 0, 1, 2}, 0) == 4)
	assert(search([]int{4, 5, 6, 7, 0, 1, 2}, 3) == -1)
	assert(search([]int{1}, 0) == -1)
	assert(search([]int{1}, 1) == 0)
	assert(search([]int{3, 1}, 1) == 1)
	assert(search([]int{3, 1}, 3) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
