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

func isBipartite(graph [][]int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(isBipartite([][]int{{1, 2, 3}, {0, 2}, {0, 1, 3}, {0, 2}}) == false)
	assert(isBipartite([][]int{{1, 3}, {0, 2}, {1, 3}, {0, 2}}) == true)
	assert(isBipartite([][]int{{}}) == true)
	assert(isBipartite([][]int{{1}, {0}}) == true)
	assert(isBipartite([][]int{{1, 2}, {0, 2}, {0, 1}}) == false)
	assert(isBipartite([][]int{{1}, {0}, {3}, {2}}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
