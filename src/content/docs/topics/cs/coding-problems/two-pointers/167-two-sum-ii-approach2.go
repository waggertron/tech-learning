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

func sliceEq(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func twoSum(numbers []int, target int) []int {
	n := len(numbers)
	for i := 0; i < n; i++ {
		need := target - numbers[i]
		j := sort.SearchInts(numbers[i+1:], need) + i + 1
		if j < n && numbers[j] == need {
			return []int{i + 1, j + 1}
		}
	}
	return []int{}
}

func runTests() {
	assert(sliceEq(twoSum([]int{2, 7, 11, 15}, 9), []int{1, 2}))
	assert(sliceEq(twoSum([]int{2, 3, 4}, 6), []int{1, 3}))
	assert(sliceEq(twoSum([]int{3, 3}, 6), []int{1, 2}))
	assert(sliceEq(twoSum([]int{1, 2, 3, 4, 5}, 9), []int{4, 5}))
	assert(sliceEq(twoSum([]int{-3, -1, 0, 2, 4}, 1), []int{1, 5}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
