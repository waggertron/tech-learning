package main

import "fmt"

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func merge(intervals [][]int) [][]int {
	// TODO: implement
	return nil
}

func slices2DEqual(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
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
	assert(slices2DEqual(merge([][]int{{1, 3}, {2, 6}, {8, 10}, {15, 18}}), [][]int{{1, 6}, {8, 10}, {15, 18}}))
	assert(slices2DEqual(merge([][]int{{1, 4}, {4, 5}}), [][]int{{1, 5}}))
	assert(slices2DEqual(merge([][]int{{1, 2}}), [][]int{{1, 2}}))
	assert(slices2DEqual(merge([][]int{{1, 10}, {2, 5}, {3, 8}}), [][]int{{1, 10}}))
	assert(slices2DEqual(merge([][]int{{1, 2}, {3, 4}, {5, 6}}), [][]int{{1, 2}, {3, 4}, {5, 6}}))
	assert(slices2DEqual(merge([][]int{{15, 18}, {1, 3}, {2, 6}, {8, 10}}), [][]int{{1, 6}, {8, 10}, {15, 18}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
