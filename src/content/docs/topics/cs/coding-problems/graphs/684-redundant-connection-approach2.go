package main

import "fmt"

func findRedundantConnection(edges [][]int) []int {
	n := len(edges)
	parent := make([]int, n+1)
	for i := range parent {
		parent[i] = i
	}

	var find func(x int) int
	find = func(x int) int {
		for parent[x] != x {
			parent[x] = parent[parent[x]]
			x = parent[x]
		}
		return x
	}

	union := func(a, b int) bool {
		ra, rb := find(a), find(b)
		if ra == rb {
			return false
		}
		parent[ra] = rb
		return true
	}

	for _, e := range edges {
		if !union(e[0], e[1]) {
			return []int{e[0], e[1]}
		}
	}
	return []int{}
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
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
