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

func threeSum(nums []int) [][]int {
	// TODO: implement
	return nil
}

func runTests() {
	assert(len(threeSum([]int{0, 1, 1})) == 0)
	r := threeSum([]int{0, 0, 0})
	assert(len(r) == 1 && r[0][0] == 0 && r[0][1] == 0 && r[0][2] == 0)
	assert(len(threeSum([]int{})) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
