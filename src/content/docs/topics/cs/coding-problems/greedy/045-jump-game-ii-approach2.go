package main

import "fmt"

func jump(nums []int) int {
	n := len(nums)
	if n <= 1 {
		return 0
	}
	visited := make([]bool, n)
	visited[0] = true
	level := 0
	frontier := []int{0}
	for len(frontier) > 0 {
		level++
		var nextFrontier []int
		for _, i := range frontier {
			for k := 1; k <= nums[i]; k++ {
				j := i + k
				if j >= n-1 {
					return level
				}
				if !visited[j] {
					visited[j] = true
					nextFrontier = append(nextFrontier, j)
				}
			}
		}
		frontier = nextFrontier
	}
	return -1
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(jump([]int{2, 3, 1, 1, 4}) == 2)
	assert(jump([]int{2, 3, 0, 1, 4}) == 2)
	assert(jump([]int{1}) == 0)
	assert(jump([]int{1, 1, 1, 1}) == 3)
	assert(jump([]int{5, 4, 3, 2, 1, 0}) == 1)
	fmt.Println("all tests pass")
}
