package main

import "fmt"

func jump(nums []int) int {
	jumps := 0
	currentEnd := 0
	farthest := 0
	for i := 1; i < len(nums); i++ {
		if i+nums[i] > farthest {
			farthest = i + nums[i]
		}
		if i == currentEnd {
			jumps++
			currentEnd = farthest
		}
	}
	return jumps
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(jump([]int{2, 3, 1, 1, 4}) == 2)
	assert(jump([]int{2, 3, 0, 1, 4}) == 2)
	assert(jump([]int{1}) == 0)
	assert(jump([]int{1, 1, 1, 1}) == 3)
	assert(jump([]int{5, 4, 3, 2, 1, 0}) == 1)
	fmt.Println("all tests pass")
}
