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

func countComponents(n int, edges [][]int) int {
	// TODO: implement
	return 0
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
