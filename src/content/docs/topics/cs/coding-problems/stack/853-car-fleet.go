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

func carFleet(target int, position []int, speed []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(carFleet(12, []int{10, 8, 0, 5, 3}, []int{2, 4, 1, 1, 3}) == 3)
	assert(carFleet(10, []int{3}, []int{3}) == 1)
	assert(carFleet(100, []int{0, 2, 4}, []int{4, 2, 1}) == 1)
	assert(carFleet(10, []int{6, 8}, []int{3, 2}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
