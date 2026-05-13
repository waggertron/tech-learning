package main

import "fmt"

func countComponents(n int, edges [][]int) int {
	parent := make([]int, n)
	for i := range parent {
		parent[i] = i
	}
	count := n

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
		if ru != rv {
			parent[ru] = rv
			count--
		}
	}
	return count
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
	assert(countComponents(5, [][]int{{0, 1}, {1, 2}, {3, 4}}) == 2)
	assert(countComponents(5, [][]int{{0, 1}, {1, 2}, {2, 3}, {3, 4}}) == 1)
	assert(countComponents(4, [][]int{}) == 4)
	assert(countComponents(1, [][]int{}) == 1)
	assert(countComponents(3, [][]int{{0, 1}, {1, 2}, {0, 2}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
