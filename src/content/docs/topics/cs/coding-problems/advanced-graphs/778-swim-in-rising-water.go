package main

import (
	"fmt"
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

func swimInWater(grid [][]int) int {
	// TODO: implement
	return -1
}

func runTests() {
	assert(swimInWater([][]int{{0, 2}, {1, 3}}) == 3)
	assert(swimInWater([][]int{
		{0, 1, 2, 3, 4},
		{24, 23, 22, 21, 5},
		{12, 13, 14, 15, 16},
		{11, 17, 18, 19, 20},
		{10, 9, 8, 7, 6},
	}) == 16)
	assert(swimInWater([][]int{{0}}) == 0)
	assert(swimInWater([][]int{{7}}) == 7)
	assert(swimInWater([][]int{{0, 1}, {3, 2}}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
