package main

import "fmt"

func mergeTriplets(triplets [][]int, target []int) bool {
	hit := [3]bool{}
	for _, t := range triplets {
		if t[0] > target[0] || t[1] > target[1] || t[2] > target[2] {
			continue
		}
		for i := 0; i < 3; i++ {
			if t[i] == target[i] {
				hit[i] = true
			}
		}
	}
	return hit[0] && hit[1] && hit[2]
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(mergeTriplets([][]int{{2, 5, 3}, {1, 8, 4}, {1, 7, 5}}, []int{2, 7, 5}) == true)
	assert(mergeTriplets([][]int{{1, 3, 4}, {2, 5, 8}}, []int{2, 5, 8}) == true)
	assert(mergeTriplets([][]int{{3, 4, 5}}, []int{2, 5, 8}) == false)
	assert(mergeTriplets([][]int{{1, 1, 1}}, []int{1, 1, 1}) == true)
	assert(mergeTriplets([][]int{{1, 0, 0}, {0, 1, 0}, {0, 0, 1}}, []int{1, 1, 1}) == true)
	fmt.Println("all tests pass")
}
