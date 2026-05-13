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

func lengthOfLIS(nums []int) int {
	tails := []int{}
	for _, x := range nums {
		i := sort.SearchInts(tails, x)
		if i == len(tails) {
			tails = append(tails, x)
		} else {
			tails[i] = x
		}
	}
	return len(tails)
}

func runTests() {
	assert(lengthOfLIS([]int{10, 9, 2, 5, 3, 7, 101, 18}) == 4)
	assert(lengthOfLIS([]int{0, 1, 0, 3, 2, 3}) == 4)
	assert(lengthOfLIS([]int{7, 7, 7, 7}) == 1)
	assert(lengthOfLIS([]int{1}) == 1)
	assert(lengthOfLIS([]int{1, 2, 3, 4, 5}) == 5)
	assert(lengthOfLIS([]int{5, 4, 3, 2, 1}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
