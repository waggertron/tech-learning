package main

import (
	"fmt"
	"sort"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func threeSum(nums []int) [][]int {
	sort.Ints(nums)
	n := len(nums)
	result := [][]int{}
	for i := 0; i < n-2; i++ {
		if i > 0 && nums[i] == nums[i-1] {
			continue
		}
		seen := map[int]bool{}
		j := i + 1
		for j < n {
			need := -nums[i] - nums[j]
			if seen[need] {
				result = append(result, []int{nums[i], need, nums[j]})
				for j+1 < n && nums[j+1] == nums[j] {
					j++
				}
			}
			seen[nums[j]] = true
			j++
		}
	}
	return result
}

func runTests() {
	assert(len(threeSum([]int{0, 1, 1})) == 0)
	r := threeSum([]int{0, 0, 0})
	assert(len(r) == 1 && r[0][0] == 0 && r[0][1] == 0 && r[0][2] == 0)
	assert(len(threeSum([]int{})) == 0)
	r2 := threeSum([]int{-2, 0, 0, 2, 2})
	assert(len(r2) == 1 && r2[0][0] == -2 && r2[0][1] == 0 && r2[0][2] == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
