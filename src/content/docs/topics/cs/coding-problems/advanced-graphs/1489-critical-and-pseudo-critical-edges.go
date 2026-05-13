package main

import (
	"fmt"
	"reflect"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func findCriticalAndPseudoCriticalEdges(n int, edges [][]int) [][]int {
	// TODO: implement
	return nil
}

func runTests() {
	assert(reflect.DeepEqual(
		findCriticalAndPseudoCriticalEdges(5, [][]int{{0, 1, 1}, {1, 2, 1}, {2, 3, 2}, {0, 3, 2}, {0, 4, 3}, {3, 4, 3}, {1, 4, 6}}),
		[][]int{{0, 1}, {2, 3, 4, 5}},
	))
	assert(reflect.DeepEqual(
		findCriticalAndPseudoCriticalEdges(4, [][]int{{0, 1, 1}, {1, 2, 1}, {2, 3, 1}, {0, 3, 1}}),
		[][]int{{}, {0, 1, 2, 3}},
	))
	assert(reflect.DeepEqual(
		findCriticalAndPseudoCriticalEdges(2, [][]int{{0, 1, 5}}),
		[][]int{{0}, {}},
	))
	fmt.Println("all tests pass")
}

func main() { runTests() }
