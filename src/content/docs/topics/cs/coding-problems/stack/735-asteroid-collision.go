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

func asteroidCollision(asteroids []int) []int {
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
	assert(sliceEq(asteroidCollision([]int{5, 10, -5}), []int{5, 10}))
	assert(sliceEq(asteroidCollision([]int{8, -8}), []int{}))
	assert(sliceEq(asteroidCollision([]int{10, 2, -5}), []int{10}))
	assert(sliceEq(asteroidCollision([]int{-2, -1, 1, 2}), []int{-2, -1, 1, 2}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
