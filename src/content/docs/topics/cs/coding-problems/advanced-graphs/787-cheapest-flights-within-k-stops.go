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

func findCheapestPrice(n int, flights [][]int, src int, dst int, k int) int {
	// TODO: implement
	return -1
}

func runTests() {
	flights := [][]int{{0, 1, 100}, {1, 2, 100}, {2, 0, 100}, {1, 3, 600}, {2, 3, 200}}
	assert(findCheapestPrice(4, flights, 0, 3, 1) == 700)
	assert(findCheapestPrice(4, flights, 0, 3, 0) == -1)
	assert(findCheapestPrice(4, flights, 0, 3, 2) == 400)
	assert(findCheapestPrice(2, [][]int{{0, 1, 500}}, 0, 1, 0) == 500)
	assert(findCheapestPrice(3, [][]int{{0, 1, 100}, {1, 2, 50}}, 1, 1, 1) == 0)
	assert(findCheapestPrice(3, [][]int{{0, 1, 100}}, 0, 2, 5) == -1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
