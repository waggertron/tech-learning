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

func longestConsecutive(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	// deduplicate
	seen := make(map[int]struct{})
	for _, n := range nums {
		seen[n] = struct{}{}
	}
	unique := make([]int, 0, len(seen))
	for n := range seen {
		unique = append(unique, n)
	}
	sort.Ints(unique)
	best, cur := 1, 1
	for i := 1; i < len(unique); i++ {
		if unique[i] == unique[i-1]+1 {
			cur++
			if cur > best {
				best = cur
			}
		} else {
			cur = 1
		}
	}
	return best
}

func runTests() {
	assert(longestConsecutive([]int{100, 4, 200, 1, 3, 2}) == 4, "test 1")
	assert(longestConsecutive([]int{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}) == 9, "test 2")
	assert(longestConsecutive([]int{}) == 0, "test 3")
	assert(longestConsecutive([]int{1}) == 1, "test 4")
	assert(longestConsecutive([]int{1, 2, 3, 4, 5}) == 5, "test 5")
	assert(longestConsecutive([]int{5, 4, 3, 2, 1}) == 5, "test 6")
	fmt.Println("all tests pass")
}

func main() { runTests() }
