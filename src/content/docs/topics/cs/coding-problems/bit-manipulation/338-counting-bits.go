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

func countBits(n int) []int {
	// TODO: implement
	return []int{}
}

func sliceEq(a, b []int) bool {
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
	assert(sliceEq(countBits(2), []int{0, 1, 1}))
	assert(sliceEq(countBits(5), []int{0, 1, 1, 2, 1, 2}))
	assert(sliceEq(countBits(0), []int{0}))
	assert(sliceEq(countBits(1), []int{0, 1}))
	assert(sliceEq(countBits(8), []int{0, 1, 1, 2, 1, 2, 2, 3, 1}))
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
