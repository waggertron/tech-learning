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

func combinationSum2(candidates []int, target int) [][]int {
	sort.Ints(candidates)              // L1: O(n log n) sort
	result := [][]int{}
	path := []int{}

	var backtrack func(start, remaining int)
	backtrack = func(start, remaining int) {
		if remaining == 0 {
			cp := make([]int, len(path))
			copy(cp, path)
			result = append(result, cp) // L2: O(k) copy
			return
		}
		for i := start; i < len(candidates); i++ {
			if candidates[i] > remaining {
				break                                           // L3: O(1) prune
			}
			if i > start && candidates[i] == candidates[i-1] {
				continue                                        // L4: O(1) skip same-level duplicate
			}
			path = append(path, candidates[i])                 // L5: O(1) push
			backtrack(i+1, remaining-candidates[i])            // L6: recurse (i+1, no reuse)
			path = path[:len(path)-1]                          // L7: O(1) pop
		}
	}

	backtrack(0, target)
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
	r := combinationSum2([]int{10, 1, 2, 7, 6, 1, 5}, 8)
	assert(slices2DEqual(r, [][]int{{1, 1, 6}, {1, 2, 5}, {1, 7}, {2, 6}}), "combinationSum2([10,1,2,7,6,1,5], 8) failed")

	r2 := combinationSum2([]int{2, 5, 2, 1, 2}, 5)
	assert(slices2DEqual(r2, [][]int{{1, 2, 2}, {5}}), "combinationSum2([2,5,2,1,2], 5) failed")

	r3 := combinationSum2([]int{1, 2}, 10)
	assert(len(r3) == 0, "combinationSum2([1,2], 10) should be empty")

	r4 := combinationSum2([]int{3, 3}, 3)
	assert(slices2DEqual(r4, [][]int{{3}}), "combinationSum2([3,3], 3) failed")

	fmt.Println("all tests pass")
}

func main() { runTests() }
