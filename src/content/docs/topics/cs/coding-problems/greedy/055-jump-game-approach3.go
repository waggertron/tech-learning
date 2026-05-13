package main

import "fmt"

func canJump(nums []int) bool {
	maxReach := 0
	for i, x := range nums {
		if i > maxReach {
			return false
		}
		if i+x > maxReach {
			maxReach = i + x
		}
		if maxReach >= len(nums)-1 {
			return true
		}
	}
	return true
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
