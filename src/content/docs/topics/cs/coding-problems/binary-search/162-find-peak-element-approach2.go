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

func findPeakElement(nums []int) int {
	lo, hi := 0, len(nums)-1
	for lo < hi {
		mid := (lo + hi) / 2
		if nums[mid] < nums[mid+1] {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return lo
}

func runTests() {
	r1 := findPeakElement([]int{1, 2, 3, 1})
	assert(r1 == 2, fmt.Sprintf("expected 2, got %d", r1))

	r2 := findPeakElement([]int{1, 2, 1, 3, 5, 6, 4})
	assert(r2 == 1 || r2 == 5, fmt.Sprintf("expected 1 or 5, got %d", r2))

	assert(findPeakElement([]int{1}) == 0)
	assert(findPeakElement([]int{1, 2, 3}) == 2)
	assert(findPeakElement([]int{3, 2, 1}) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
