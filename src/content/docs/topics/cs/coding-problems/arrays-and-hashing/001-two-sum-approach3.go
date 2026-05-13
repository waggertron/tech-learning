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

func twoSum(nums []int, target int) []int {
	seen := make(map[int]int)
	for i, x := range nums {
		complement := target - x
		if j, ok := seen[complement]; ok {
			return []int{j, i}
		}
		seen[x] = i
	}
	return []int{}
}

func runTests() {
	assert(fmt.Sprint(twoSum([]int{2, 7, 11, 15}, 9)) == fmt.Sprint([]int{0, 1}), "test 1")
	assert(fmt.Sprint(twoSum([]int{3, 2, 4}, 6)) == fmt.Sprint([]int{1, 2}), "test 2")
	assert(fmt.Sprint(twoSum([]int{3, 3}, 6)) == fmt.Sprint([]int{0, 1}), "test 3")
	assert(fmt.Sprint(twoSum([]int{1, 2, 3, 4, 5}, 9)) == fmt.Sprint([]int{3, 4}), "test 4")
	assert(fmt.Sprint(twoSum([]int{0, 4}, 4)) == fmt.Sprint([]int{0, 1}), "test 5")
	fmt.Println("all tests pass")
}

func main() { runTests() }
