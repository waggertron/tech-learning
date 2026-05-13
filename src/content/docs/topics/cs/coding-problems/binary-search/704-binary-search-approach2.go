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
	var helper func(lo, hi int) int
	helper = func(lo, hi int) int {
		if lo > hi {
			return -1
		}
		mid := (lo + hi) / 2
		if nums[mid] == target {
			return mid
		}
		if nums[mid] < target {
			return helper(mid+1, hi)
		}
		return helper(lo, mid-1)
	}
	return helper(0, len(nums)-1)
}

func runTests() {
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 9) == 4)
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 2) == -1)
	assert(search([]int{5}, 5) == 0)
	assert(search([]int{5}, 3) == -1)
	assert(search([]int{-1, 0, 3, 5, 9, 12}, -1) == 0)
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 12) == 5)
	fmt.Println("all tests pass")
}

func main() { runTests() }
