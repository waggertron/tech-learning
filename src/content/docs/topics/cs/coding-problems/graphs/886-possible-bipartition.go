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

func possibleBipartition(n int, dislikes [][]int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(possibleBipartition(4, [][]int{{1, 2}, {1, 3}, {2, 4}}) == true)
	assert(possibleBipartition(3, [][]int{{1, 2}, {1, 3}, {2, 3}}) == false)
	assert(possibleBipartition(5, [][]int{{1, 2}, {2, 3}, {3, 4}, {4, 5}, {1, 5}}) == false)
	assert(possibleBipartition(4, [][]int{}) == true)
	assert(possibleBipartition(4, [][]int{{1, 2}, {3, 4}}) == true)
	assert(possibleBipartition(1, [][]int{}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
