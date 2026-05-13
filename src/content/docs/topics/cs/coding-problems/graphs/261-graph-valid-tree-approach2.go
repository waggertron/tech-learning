package main

import "fmt"

func validTree(n int, edges [][]int) bool {
	if len(edges) != n-1 {
		return false
	}
	parent := make([]int, n)
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

	for _, e := range edges {
		ru, rv := find(e[0]), find(e[1])
		if ru == rv {
			return false
		}
		parent[ru] = rv
	}
	return true
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

func runTests() {
	assert(validTree(5, [][]int{{0, 1}, {0, 2}, {0, 3}, {1, 4}}) == true)
	assert(validTree(5, [][]int{{0, 1}, {1, 2}, {2, 3}, {1, 3}, {1, 4}}) == false)
	assert(validTree(1, [][]int{}) == true)
	assert(validTree(2, [][]int{{0, 1}}) == true)
	assert(validTree(2, [][]int{}) == false)
	assert(validTree(3, [][]int{{0, 1}, {1, 2}, {0, 2}}) == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
