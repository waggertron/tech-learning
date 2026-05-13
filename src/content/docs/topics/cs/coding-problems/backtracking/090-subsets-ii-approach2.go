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

func subsetsWithDup(nums []int) [][]int {
	sort.Ints(nums)            // L1: O(n log n) sort
	result := [][]int{}
	path := []int{}

	var backtrack func(start int)
	backtrack = func(start int) {
		cp := make([]int, len(path))
		copy(cp, path)
		result = append(result, cp) // L2: O(k) copy at every node (not just leaves)
		for i := start; i < len(nums); i++ {
			if i > start && nums[i] == nums[i-1] {
				continue              // L3: O(1) skip same-level duplicate
			}
			path = append(path, nums[i]) // L4: O(1) push
			backtrack(i + 1)             // L5: recurse
			path = path[:len(path)-1]    // L6: O(1) pop
		}
	}

	backtrack(0)
	return result
}

func slices2DEqual(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		sort.Ints(a[i])
		sort.Ints(b[i])
	}
	sort.Slice(a, func(i, j int) bool { return fmt.Sprint(a[i]) < fmt.Sprint(a[j]) })
	sort.Slice(b, func(i, j int) bool { return fmt.Sprint(b[i]) < fmt.Sprint(b[j]) })
	for i := range a {
		if len(a[i]) != len(b[i]) {
			return false
		}
		for j := range a[i] {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}
	return true
}

func runTests() {
	r := subsetsWithDup([]int{1, 2, 2})
	assert(slices2DEqual(r, [][]int{{}, {1}, {2}, {1, 2}, {2, 2}, {1, 2, 2}}), "subsetsWithDup([1,2,2]) failed")

	r2 := subsetsWithDup([]int{0})
	assert(slices2DEqual(r2, [][]int{{}, {0}}), "subsetsWithDup([0]) failed")

	r3 := subsetsWithDup([]int{2, 2, 2})
	assert(slices2DEqual(r3, [][]int{{}, {2}, {2, 2}, {2, 2, 2}}), "subsetsWithDup([2,2,2]) failed")

	fmt.Println("all tests pass")
}

func main() { runTests() }
