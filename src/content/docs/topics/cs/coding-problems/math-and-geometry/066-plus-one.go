package main

import (
	"fmt"
	"reflect"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func plusOne(digits []int) []int {
	// TODO: implement
	return nil
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
