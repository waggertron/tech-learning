package main

import "fmt"

func maxSubArray(nums []int) int {
	var helper func(lo, hi int) int
	helper = func(lo, hi int) int {
		if lo == hi {
			return nums[lo]
		}
		mid := (lo + hi) / 2
		leftMax := helper(lo, mid)
		rightMax := helper(mid+1, hi)

		leftSuffix := -1 << 62
		total := 0
		for i := mid; i >= lo; i-- {
			total += nums[i]
			if total > leftSuffix {
				leftSuffix = total
			}
		}
		rightPrefix := -1 << 62
		total = 0
		for i := mid + 1; i <= hi; i++ {
			total += nums[i]
			if total > rightPrefix {
				rightPrefix = total
			}
		}
		max := func(a, b int) int {
			if a > b {
				return a
			}
			return b
		}
		return max(max(leftMax, rightMax), leftSuffix+rightPrefix)
	}
	return helper(0, len(nums)-1)
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(maxSubArray([]int{-2, 1, -3, 4, -1, 2, 1, -5, 4}) == 6)
	assert(maxSubArray([]int{1}) == 1)
	assert(maxSubArray([]int{5, 4, -1, 7, 8}) == 23)
	assert(maxSubArray([]int{-1}) == -1)
	assert(maxSubArray([]int{-2, -3, -1, -5}) == -1)
	assert(maxSubArray([]int{1, 2, 3, 4, 5}) == 15)
	fmt.Println("all tests pass")
}
