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

func maxArea(height []int) int {
	l, r := 0, len(height)-1
	best := 0
	for l < r {
		h := height[l]
		if height[r] < h {
			h = height[r]
		}
		area := h * (r - l)
		if area > best {
			best = area
		}
		if height[l] < height[r] {
			l++
		} else {
			r--
		}
	}
	return best
}

func runTests() {
	assert(maxArea([]int{1, 8, 6, 2, 5, 4, 8, 3, 7}) == 49)
	assert(maxArea([]int{1, 1}) == 1)
	assert(maxArea([]int{1, 2, 1}) == 2)
	assert(maxArea([]int{4, 3, 2, 1, 4}) == 16)
	assert(maxArea([]int{1, 2, 4, 3}) == 4)
	fmt.Println("all tests pass")
}

func main() { runTests() }
