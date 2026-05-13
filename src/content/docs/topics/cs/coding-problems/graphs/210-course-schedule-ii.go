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

func findOrder(numCourses int, prerequisites [][]int) []int {
	// TODO: implement
	return nil
}

func indexOf(slice []int, val int) int {
	for i, v := range slice {
		if v == val {
			return i
		}
	}
	return -1
}

func runTests() {
	r1 := findOrder(2, [][]int{{1, 0}})
	assert(len(r1) == 2 && r1[0] == 0 && r1[1] == 1)

	r2 := findOrder(4, [][]int{{1, 0}, {2, 0}, {3, 1}, {3, 2}})
	assert(indexOf(r2, 0) < indexOf(r2, 1))
	assert(indexOf(r2, 0) < indexOf(r2, 2))
	assert(indexOf(r2, 1) < indexOf(r2, 3))
	assert(indexOf(r2, 2) < indexOf(r2, 3))

	assert(len(findOrder(2, [][]int{{1, 0}, {0, 1}})) == 0)
	r3 := findOrder(1, [][]int{})
	assert(len(r3) == 1 && r3[0] == 0)
	assert(len(findOrder(3, [][]int{{0, 1}, {1, 2}, {2, 0}})) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
