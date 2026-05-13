package main

import (
	"fmt"
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

func kClosest(points [][]int, k int) [][]int {
	// TODO: implement
	return nil
}

func runTests() {
	result := kClosest([][]int{{1, 3}, {-2, 2}}, 1)
	assert(len(result) == 1 && result[0][0] == -2 && result[0][1] == 2)

	result2 := kClosest([][]int{{3, 3}, {5, -1}, {-2, 4}}, 2)
	assert(len(result2) == 2)

	result3 := kClosest([][]int{{0, 0}}, 1)
	assert(len(result3) == 1 && result3[0][0] == 0 && result3[0][1] == 0)

	result4 := kClosest([][]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}, 2)
	assert(len(result4) == 2)

	result5 := kClosest([][]int{{1, 2}, {3, 4}, {0, 0}}, 3)
	assert(len(result5) == 3)

	fmt.Println("all tests pass")
}

func main() { runTests() }
