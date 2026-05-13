package main

import "fmt"

func maxSubArray(nums []int) int {
	max := func(a, b int) int {
		if a > b {
			return a
		}
		return b
	}
	best := nums[0]
	cur := nums[0]
	for _, x := range nums[1:] {
		cur = max(x, cur+x)
		best = max(best, cur)
	}
	return best
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
