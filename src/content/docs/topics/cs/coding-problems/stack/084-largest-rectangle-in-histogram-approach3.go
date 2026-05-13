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
	h := append(heights, 0) // sentinel
	stack := []int{}
	best := 0
	for i := 0; i < len(h); i++ {
		for len(stack) > 0 && h[stack[len(stack)-1]] > h[i] {
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			height := h[top]
			width := i
			if len(stack) > 0 {
				width = i - stack[len(stack)-1] - 1
			}
			area := height * width
			if area > best {
				best = area
			}
		}
		stack = append(stack, i)
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
