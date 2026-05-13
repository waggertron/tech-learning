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

func maxProduct(nums []int) int {
	maxHere, minHere, best := nums[0], nums[0], nums[0]
	for _, x := range nums[1:] {
		if x < 0 {
			maxHere, minHere = minHere, maxHere
		}
		if x > maxHere*x {
			maxHere = x
		} else {
			maxHere = maxHere * x
		}
		if x < minHere*x {
			minHere = x
		} else {
			minHere = minHere * x
		}
		if maxHere > best {
			best = maxHere
		}
	}
	return best
}

func runTests() {
	assert(maxProduct([]int{2, 3, -2, 4}) == 6)
	assert(maxProduct([]int{-2, 0, -1}) == 0)
	assert(maxProduct([]int{-2, 3, -4}) == 24)
	assert(maxProduct([]int{0}) == 0)
	assert(maxProduct([]int{-3}) == -3)
	assert(maxProduct([]int{-2, -3}) == 6)
	fmt.Println("all tests pass")
}

func main() { runTests() }
