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
	r := subsetsWithDup([]int{1, 2, 2})
	assert(slices2DEqual(r, [][]int{{}, {1}, {2}, {1, 2}, {2, 2}, {1, 2, 2}}), "subsetsWithDup([1,2,2]) failed")

	r2 := subsetsWithDup([]int{0})
	assert(slices2DEqual(r2, [][]int{{}, {0}}), "subsetsWithDup([0]) failed")

	r3 := subsetsWithDup([]int{2, 2, 2})
	assert(slices2DEqual(r3, [][]int{{}, {2}, {2, 2}, {2, 2, 2}}), "subsetsWithDup([2,2,2]) failed")

	fmt.Println("all tests pass")
}

func main() { runTests() }
