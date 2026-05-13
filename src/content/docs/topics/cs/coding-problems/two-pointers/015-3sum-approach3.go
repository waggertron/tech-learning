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
		if nums[i] > 0 {
			break
		}
		if i > 0 && nums[i] == nums[i-1] {
			continue
		}
		l, r := i+1, n-1
		for l < r {
			s := nums[i] + nums[l] + nums[r]
			if s < 0 {
				l++
			} else if s > 0 {
				r--
			} else {
				result = append(result, []int{nums[i], nums[l], nums[r]})
				l++
				r--
				for l < r && nums[l] == nums[l-1] {
					l++
				}
				for l < r && nums[r] == nums[r+1] {
					r--
				}
			}
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
