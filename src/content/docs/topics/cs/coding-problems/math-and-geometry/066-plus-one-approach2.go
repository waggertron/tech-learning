package main

import (
	"fmt"
	"reflect"
)

func plusOne(digits []int) []int {
	for i := len(digits) - 1; i >= 0; i-- {    // L1: walk right to left
		if digits[i] < 9 {                      // L2: O(1)
			digits[i]++                         // L3: O(1), no carry needed
			return digits
		}
		digits[i] = 0                           // L4: O(1), carry continues
	}
	return append([]int{1}, digits...)          // L5: O(n), all nines case
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func runTests() {
	assert(reflect.DeepEqual(plusOne([]int{1, 2, 3}), []int{1, 2, 4}))
	assert(reflect.DeepEqual(plusOne([]int{9, 9, 9}), []int{1, 0, 0, 0}))
	assert(reflect.DeepEqual(plusOne([]int{0}), []int{1}))
	assert(reflect.DeepEqual(plusOne([]int{9}), []int{1, 0}))
	assert(reflect.DeepEqual(plusOne([]int{1, 0, 9}), []int{1, 1, 0}))
	assert(reflect.DeepEqual(plusOne([]int{4, 3, 2, 1}), []int{4, 3, 2, 2}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
