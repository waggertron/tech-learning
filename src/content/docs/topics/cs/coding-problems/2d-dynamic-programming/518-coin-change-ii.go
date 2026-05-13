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

func change(amount int, coins []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(change(5, []int{1, 2, 5}) == 4)
	assert(change(3, []int{2}) == 0)
	assert(change(0, []int{1, 2, 5}) == 1)
	assert(change(10, []int{5}) == 1)
	assert(change(10, []int{1, 5, 10}) == 4)
	fmt.Println("all tests pass")
}

func main() { runTests() }
