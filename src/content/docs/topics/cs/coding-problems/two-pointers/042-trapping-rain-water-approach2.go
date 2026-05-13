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

func trap(height []int) int {
	n := len(height)
	if n == 0 {
		return 0
	}
	leftMax := make([]int, n)
	rightMax := make([]int, n)

	leftMax[0] = height[0]
	for i := 1; i < n; i++ {
		if height[i] > leftMax[i-1] {
			leftMax[i] = height[i]
		} else {
			leftMax[i] = leftMax[i-1]
		}
	}

	rightMax[n-1] = height[n-1]
	for i := n - 2; i >= 0; i-- {
		if height[i] > rightMax[i+1] {
			rightMax[i] = height[i]
		} else {
			rightMax[i] = rightMax[i+1]
		}
	}

	total := 0
	for i := 0; i < n; i++ {
		lm := leftMax[i]
		rm := rightMax[i]
		if rm < lm {
			lm = rm
		}
		total += lm - height[i]
	}
	return total
}

func runTests() {
	assert(trap([]int{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}) == 6)
	assert(trap([]int{4, 2, 0, 3, 2, 5}) == 9)
	assert(trap([]int{}) == 0)
	assert(trap([]int{3}) == 0)
	assert(trap([]int{3, 0, 3}) == 3)
	assert(trap([]int{1, 0, 1}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
