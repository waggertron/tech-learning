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

func updateMatrix(mat [][]int) [][]int {
	// TODO: implement
	return nil
}

func eqMatrix(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if len(a[i]) != len(b[i]) {
			return false
		}
		for j := range a[i] {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}
	return true
}

func runTests() {
	assert(eqMatrix(updateMatrix([][]int{{0, 0, 0}, {0, 1, 0}, {0, 0, 0}}), [][]int{{0, 0, 0}, {0, 1, 0}, {0, 0, 0}}))
	assert(eqMatrix(updateMatrix([][]int{{0, 0, 0}, {0, 1, 0}, {1, 1, 1}}), [][]int{{0, 0, 0}, {0, 1, 0}, {1, 2, 1}}))
	assert(eqMatrix(updateMatrix([][]int{{0, 0}, {0, 0}}), [][]int{{0, 0}, {0, 0}}))
	assert(eqMatrix(updateMatrix([][]int{{0}}), [][]int{{0}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
