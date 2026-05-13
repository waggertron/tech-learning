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

func pacificAtlantic(heights [][]int) [][]int {
	// TODO: implement
	return nil
}

func eqResult(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	sort.Slice(a, func(i, j int) bool {
		if a[i][0] != a[j][0] {
			return a[i][0] < a[j][0]
		}
		return a[i][1] < a[j][1]
	})
	sort.Slice(b, func(i, j int) bool {
		if b[i][0] != b[j][0] {
			return b[i][0] < b[j][0]
		}
		return b[i][1] < b[j][1]
	})
	for i := range a {
		if a[i][0] != b[i][0] || a[i][1] != b[i][1] {
			return false
		}
	}
	return true
}

func runTests() {
	h1 := [][]int{{1, 2, 2, 3, 5}, {3, 2, 3, 4, 4}, {2, 4, 5, 3, 1}, {6, 7, 1, 4, 5}, {5, 1, 1, 2, 4}}
	expected1 := [][]int{{0, 4}, {1, 3}, {1, 4}, {2, 2}, {3, 0}, {3, 1}, {4, 0}}
	assert(eqResult(pacificAtlantic(h1), expected1))
	assert(eqResult(pacificAtlantic([][]int{{5}}), [][]int{{0, 0}}))
	h2 := [][]int{{1, 1}, {1, 1}}
	assert(eqResult(pacificAtlantic(h2), [][]int{{0, 0}, {0, 1}, {1, 0}, {1, 1}}))
	assert(len(pacificAtlantic([][]int{})) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
