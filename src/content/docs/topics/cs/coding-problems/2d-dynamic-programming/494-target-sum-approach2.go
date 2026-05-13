package main

import "fmt"

func findTargetSumWays(nums []int, target int) int {
	memo := make(map[[2]int]int)
	var f func(i, cur int) int
	f = func(i, cur int) int {
		if i == len(nums) {
			if cur == target {
				return 1
			}
			return 0
		}
		key := [2]int{i, cur}
		if v, ok := memo[key]; ok {
			return v
		}
		result := f(i+1, cur+nums[i]) + f(i+1, cur-nums[i])
		memo[key] = result
		return result
	}
	return f(0, 0)
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(findTargetSumWays([]int{1, 1, 1, 1, 1}, 3) == 5)
	assert(findTargetSumWays([]int{1}, 1) == 1)
	assert(findTargetSumWays([]int{1, 1}, 0) == 2)
	assert(findTargetSumWays([]int{1, 2}, 4) == 0)
	assert(findTargetSumWays([]int{1}, -1) == 1)
	assert(findTargetSumWays([]int{0, 0, 0}, 0) == 8)
	fmt.Println("all tests pass")
}
