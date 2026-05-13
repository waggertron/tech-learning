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

func canFinish(numCourses int, prerequisites [][]int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(canFinish(2, [][]int{{1, 0}}) == true)
	assert(canFinish(2, [][]int{{1, 0}, {0, 1}}) == false)
	assert(canFinish(5, [][]int{}) == true)
	assert(canFinish(1, [][]int{}) == true)
	assert(canFinish(3, [][]int{{1, 0}, {2, 1}, {0, 2}}) == false)
	assert(canFinish(4, [][]int{{1, 0}, {2, 0}, {3, 1}, {3, 2}}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
