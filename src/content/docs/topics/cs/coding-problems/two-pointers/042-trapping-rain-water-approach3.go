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
	l, r := 0, len(height)-1
	leftMax, rightMax := 0, 0
	total := 0
	for l < r {
		if height[l] < height[r] {
			if height[l] >= leftMax {
				leftMax = height[l]
			} else {
				total += leftMax - height[l]
			}
			l++
		} else {
			if height[r] >= rightMax {
				rightMax = height[r]
			} else {
				total += rightMax - height[r]
			}
			r--
		}
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
