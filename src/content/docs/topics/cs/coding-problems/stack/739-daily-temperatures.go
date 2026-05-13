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

func dailyTemperatures(temperatures []int) []int {
	// TODO: implement
	return nil
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
	assert(sliceEq(dailyTemperatures([]int{73, 74, 75, 71, 69, 72, 76, 73}), []int{1, 1, 4, 2, 1, 1, 0, 0}))
	assert(sliceEq(dailyTemperatures([]int{30, 40, 50, 60}), []int{1, 1, 1, 0}))
	assert(sliceEq(dailyTemperatures([]int{30, 60, 90}), []int{1, 1, 0}))
	assert(sliceEq(dailyTemperatures([]int{90, 60, 30}), []int{0, 0, 0}))
	assert(sliceEq(dailyTemperatures([]int{70}), []int{0}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
