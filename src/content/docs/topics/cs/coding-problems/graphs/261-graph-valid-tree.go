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

func validTree(n int, edges [][]int) bool {
	// TODO: implement
	return false
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
