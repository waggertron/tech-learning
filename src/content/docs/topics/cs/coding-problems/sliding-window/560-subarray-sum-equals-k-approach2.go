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

func subarraySum(nums []int, k int) int {
	count := make(map[int]int)
	count[0] = 1
	prefix := 0
	result := 0
	for _, x := range nums {
		prefix += x
		result += count[prefix-k]
		count[prefix]++
	}
	return result
}

func runTests() {
	assert(subarraySum([]int{1, 1, 1}, 2) == 2)
	assert(subarraySum([]int{1, 2, 3}, 3) == 2)
	assert(subarraySum([]int{1}, 0) == 0)
	assert(subarraySum([]int{1}, 1) == 1)
	assert(subarraySum([]int{-1, -1, 1}, 0) == 1)
	assert(subarraySum([]int{0, 0, 0, 0}, 0) == 10)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
