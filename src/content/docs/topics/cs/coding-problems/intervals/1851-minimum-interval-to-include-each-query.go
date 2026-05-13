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

func minInterval(intervals [][]int, queries []int) []int {
	// TODO: implement
	return nil
}

func slicesEqual(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func runTests() {
	assert(slicesEqual(minInterval([][]int{{1, 4}, {2, 4}, {3, 6}, {4, 4}}, []int{2, 3, 4, 5}), []int{3, 3, 1, 4}))
	assert(slicesEqual(minInterval([][]int{{2, 3}, {2, 5}, {1, 8}, {20, 25}}, []int{2, 19, 5, 22}), []int{2, -1, 4, 6}))
	assert(slicesEqual(minInterval([][]int{{1, 3}}, []int{5}), []int{-1}))
	assert(slicesEqual(minInterval([][]int{{1, 10}}, []int{5}), []int{10}))
	assert(slicesEqual(minInterval([][]int{{1, 5}, {2, 3}}, []int{2, 3}), []int{2, 2}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
