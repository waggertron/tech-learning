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

func permute(nums []int) [][]int {
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
	r := permute([]int{1, 2, 3})
	assert(len(r) == 6, "permute([1,2,3]) should have 6 results")
	assert(slices2DEqual(r, [][]int{{1, 2, 3}, {1, 3, 2}, {2, 1, 3}, {2, 3, 1}, {3, 1, 2}, {3, 2, 1}}), "permute([1,2,3]) failed")

	r2 := permute([]int{0, 1})
	assert(slices2DEqual(r2, [][]int{{0, 1}, {1, 0}}), "permute([0,1]) failed")

	r3 := permute([]int{1})
	assert(slices2DEqual(r3, [][]int{{1}}), "permute([1]) failed")

	fmt.Println("all tests pass")
}

func main() { runTests() }
