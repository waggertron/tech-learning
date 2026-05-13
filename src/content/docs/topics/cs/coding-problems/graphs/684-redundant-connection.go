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

func findRedundantConnection(edges [][]int) []int {
	// TODO: implement
	return nil
}

func eqSlice(a, b []int) bool {
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

func runTests() {
	assert(eqSlice(findRedundantConnection([][]int{{1, 2}, {1, 3}, {2, 3}}), []int{2, 3}))
	assert(eqSlice(findRedundantConnection([][]int{{1, 2}, {2, 3}, {3, 4}, {1, 4}, {1, 5}}), []int{1, 4}))
	assert(eqSlice(findRedundantConnection([][]int{{1, 2}, {1, 2}}), []int{1, 2}))
	assert(eqSlice(findRedundantConnection([][]int{{1, 2}, {2, 3}, {1, 3}}), []int{1, 3}))
	assert(eqSlice(findRedundantConnection([][]int{{1, 2}, {2, 3}, {3, 4}, {4, 5}, {3, 5}}), []int{3, 5}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
