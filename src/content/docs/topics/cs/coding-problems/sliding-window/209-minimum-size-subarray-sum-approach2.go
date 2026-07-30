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

func minSubArrayLen(target int, nums []int) int {
	left, total := 0, 0
	best := len(nums) + 1

	for right, value := range nums { // L1: right expands n times
		total += value                // L2: O(1) add entering value
		for total >= target {         // L3: shrink while window is valid
			if right-left+1 < best {  // L4: O(1) record current length
				best = right - left + 1
			}
			total -= nums[left]        // L5: O(1) remove leaving value
			left++                     // L6: left advances at most n times
		}
	}

	if best == len(nums)+1 { // L7: O(1)
		return 0
	}
	return best
}

func runTests() {
	assert(minSubArrayLen(7, []int{2, 3, 1, 2, 4, 3}) == 2)
	assert(minSubArrayLen(4, []int{1, 4, 4}) == 1)
	assert(minSubArrayLen(11, []int{1, 1, 1, 1, 1, 1, 1, 1}) == 0)
	assert(minSubArrayLen(3, []int{1, 1, 1}) == 3)
	assert(minSubArrayLen(15, []int{5, 1, 3, 5, 10, 7, 4, 9, 2, 8}) == 2)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
