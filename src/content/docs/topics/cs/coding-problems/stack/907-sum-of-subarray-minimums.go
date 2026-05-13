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

func sumSubarrayMins(arr []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(sumSubarrayMins([]int{3, 1, 2, 4}) == 17)
	assert(sumSubarrayMins([]int{11, 81, 94, 43, 3}) == 444)
	assert(sumSubarrayMins([]int{3}) == 3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
