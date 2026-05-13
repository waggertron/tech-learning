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

func mergeTriplets(triplets [][]int, target []int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(mergeTriplets([][]int{{2, 5, 3}, {1, 8, 4}, {1, 7, 5}}, []int{2, 7, 5}) == true)
	assert(mergeTriplets([][]int{{1, 3, 4}, {2, 5, 8}}, []int{2, 5, 8}) == true)
	assert(mergeTriplets([][]int{{3, 4, 5}}, []int{2, 5, 8}) == false)
	assert(mergeTriplets([][]int{{1, 1, 1}}, []int{1, 1, 1}) == true)
	assert(mergeTriplets([][]int{{1, 0, 0}, {0, 1, 0}, {0, 0, 1}}, []int{1, 1, 1}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
