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

type NumArray struct {
	prefix []int
}

func constructor(nums []int) NumArray {
	prefix := make([]int, len(nums)+1)
	for i, v := range nums {
		prefix[i+1] = prefix[i] + v
	}
	return NumArray{prefix: prefix}
}

func (na *NumArray) sumRange(left int, right int) int {
	return na.prefix[right+1] - na.prefix[left]
}

func runTests() {
	na := constructor([]int{-2, 0, 3, -5, 2, -1})
	assert(na.sumRange(0, 2) == 1, "test 1")
	assert(na.sumRange(2, 5) == -1, "test 2")
	assert(na.sumRange(0, 5) == -3, "test 3")

	na2 := constructor([]int{5})
	assert(na2.sumRange(0, 0) == 5, "test 4")

	na3 := constructor([]int{-1, -2, -3})
	assert(na3.sumRange(0, 2) == -6, "test 5")
	assert(na3.sumRange(1, 2) == -5, "test 6")

	fmt.Println("all tests pass")
}

func main() { runTests() }
