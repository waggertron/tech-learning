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

func findCircleNum(isConnected [][]int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(findCircleNum([][]int{{1, 1, 0}, {1, 1, 0}, {0, 0, 1}}) == 2)
	assert(findCircleNum([][]int{{1, 0, 0}, {0, 1, 0}, {0, 0, 1}}) == 3)
	assert(findCircleNum([][]int{{1, 1, 1}, {1, 1, 1}, {1, 1, 1}}) == 1)
	assert(findCircleNum([][]int{{1}}) == 1)
	assert(findCircleNum([][]int{{1, 1, 0}, {1, 1, 1}, {0, 1, 1}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
