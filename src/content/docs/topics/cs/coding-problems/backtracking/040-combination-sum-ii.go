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
	// TODO: implement
	return nil
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
