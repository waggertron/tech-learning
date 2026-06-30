package main

import "fmt"

func canJump(nums []int) bool {
	leftmostGood := len(nums) - 1

	for i := len(nums) - 2; i >= 0; i-- {
		if i+nums[i] >= leftmostGood {
			leftmostGood = i
		}
	}

	return leftmostGood == 0
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(canJump([]int{2, 3, 1, 1, 4}) == true)
	assert(canJump([]int{3, 2, 1, 0, 4}) == false)
	assert(canJump([]int{0}) == true)
	assert(canJump([]int{1, 0}) == true)
	assert(canJump([]int{0, 1}) == false)
	assert(canJump([]int{2, 0, 0}) == true)
	fmt.Println("all tests pass")
}
