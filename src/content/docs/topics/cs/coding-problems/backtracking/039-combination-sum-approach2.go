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

func combinationSum(candidates []int, target int) [][]int {
	result := [][]int{}
	path := []int{}

	var backtrack func(start, remaining int)
	backtrack = func(start, remaining int) {
		if remaining == 0 {
			cp := make([]int, len(path))
			copy(cp, path)
			result = append(result, cp) // L1: O(k) copy at leaf
			return
		}
		if remaining < 0 {
			return
		}
		for i := start; i < len(candidates); i++ {
			path = append(path, candidates[i])          // L2: O(1) push
			backtrack(i, remaining-candidates[i])       // L3: recurse (reuse allowed)
			path = path[:len(path)-1]                   // L4: O(1) pop
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
	r := combinationSum([]int{2, 3, 6, 7}, 7)
	assert(slices2DEqual(r, [][]int{{2, 2, 3}, {7}}), "combinationSum([2,3,6,7], 7) failed")

	r2 := combinationSum([]int{2, 3, 5}, 8)
	assert(slices2DEqual(r2, [][]int{{2, 2, 2, 2}, {2, 3, 3}, {3, 5}}), "combinationSum([2,3,5], 8) failed")

	r3 := combinationSum([]int{3}, 9)
	assert(slices2DEqual(r3, [][]int{{3, 3, 3}}), "combinationSum([3], 9) failed")

	r4 := combinationSum([]int{5}, 3)
	assert(len(r4) == 0, "combinationSum([5], 3) should be empty")

	fmt.Println("all tests pass")
}

func main() { runTests() }
