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

func largestRectangleArea(heights []int) int {
	n := len(heights)
	left := make([]int, n)
	right := make([]int, n)
	stack := []int{}

	for i := 0; i < n; i++ {
		for len(stack) > 0 && heights[stack[len(stack)-1]] >= heights[i] {
			stack = stack[:len(stack)-1]
		}
		if len(stack) > 0 {
			left[i] = stack[len(stack)-1]
		} else {
			left[i] = -1
		}
		stack = append(stack, i)
	}

	stack = []int{}
	for i := n - 1; i >= 0; i-- {
		for len(stack) > 0 && heights[stack[len(stack)-1]] >= heights[i] {
			stack = stack[:len(stack)-1]
		}
		if len(stack) > 0 {
			right[i] = stack[len(stack)-1]
		} else {
			right[i] = n
		}
		stack = append(stack, i)
	}

	best := 0
	for i := 0; i < n; i++ {
		area := heights[i] * (right[i] - left[i] - 1)
		if area > best {
			best = area
		}
	}
	return best
}

func runTests() {
	assert(largestRectangleArea([]int{2, 1, 5, 6, 2, 3}) == 10)
	assert(largestRectangleArea([]int{2, 4}) == 4)
	assert(largestRectangleArea([]int{1}) == 1)
	assert(largestRectangleArea([]int{6, 5, 4, 3, 2, 1}) == 12)
	assert(largestRectangleArea([]int{1, 2, 3, 4, 5, 6}) == 12)
	assert(largestRectangleArea([]int{2, 0, 2}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
