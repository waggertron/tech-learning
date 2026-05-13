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
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := (lo + hi) / 2
		if nums[mid] == target {
			return mid
		}
		if nums[lo] <= nums[mid] {
			if nums[lo] <= target && target < nums[mid] {
				hi = mid - 1
			} else {
				lo = mid + 1
			}
		} else {
			if nums[mid] < target && target <= nums[hi] {
				lo = mid + 1
			} else {
				hi = mid - 1
			}
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
