package main

import "fmt"

func canJump(nums []int) bool {
	n := len(nums)
	good := make([]bool, n)
	good[n-1] = true

	for i := n - 2; i >= 0; i-- {
		furthest := i + nums[i]
		if furthest > n-1 {
			furthest = n - 1
		}
		for j := i + 1; j <= furthest; j++ {
			if good[j] {
				good[i] = true
				break
			}
		}
	}

	return good[0]
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
