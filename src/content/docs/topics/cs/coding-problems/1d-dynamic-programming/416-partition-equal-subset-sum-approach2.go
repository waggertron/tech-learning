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

func canPartition(nums []int) bool {
	total := 0
	for _, x := range nums {
		total += x
	}
	if total%2 != 0 {
		return false
	}
	target := total / 2
	memo := map[[2]int]bool{}
	var f func(i, cur int) bool
	f = func(i, cur int) bool {
		if cur == target {
			return true
		}
		if i == len(nums) || cur > target {
			return false
		}
		key := [2]int{i, cur}
		if v, ok := memo[key]; ok {
			return v
		}
		result := f(i+1, cur+nums[i]) || f(i+1, cur)
		memo[key] = result
		return result
	}
	return f(0, 0)
}

func runTests() {
	assert(canPartition([]int{1, 5, 11, 5}) == true)
	assert(canPartition([]int{1, 2, 3, 5}) == false)
	assert(canPartition([]int{1}) == false)
	assert(canPartition([]int{2, 2}) == true)
	assert(canPartition([]int{1, 2, 5}) == false)
	assert(canPartition([]int{3, 3, 3, 4, 5}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
