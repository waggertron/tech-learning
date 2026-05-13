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
	stack := []int{}

	for _, asteroid := range asteroids {
		alive := true
		for alive && len(stack) > 0 && asteroid < 0 && stack[len(stack)-1] > 0 {
			top := stack[len(stack)-1]
			if top < -asteroid {
				stack = stack[:len(stack)-1]
			} else if top == -asteroid {
				stack = stack[:len(stack)-1]
				alive = false
			} else {
				alive = false
			}
		}
		if alive {
			stack = append(stack, asteroid)
		}
	}
	return stack
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
