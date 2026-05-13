package main

import "fmt"

func mergeTripletsEarly(triplets [][]int, target []int) bool {
	hit := 0
	for _, t := range triplets {
		if t[0] > target[0] || t[1] > target[1] || t[2] > target[2] {
			continue
		}
		for i := 0; i < 3; i++ {
			if t[i] == target[i] {
				hit |= 1 << i
			}
		}
		if hit == 0b111 {
			return true
		}
	}
	return hit == 0b111
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(mergeTripletsEarly([][]int{{2, 5, 3}, {1, 8, 4}, {1, 7, 5}}, []int{2, 7, 5}) == true)
	assert(mergeTripletsEarly([][]int{{1, 3, 4}, {2, 5, 8}}, []int{2, 5, 8}) == true)
	assert(mergeTripletsEarly([][]int{{3, 4, 5}}, []int{2, 5, 8}) == false)
	assert(mergeTripletsEarly([][]int{{1, 1, 1}}, []int{1, 1, 1}) == true)
	assert(mergeTripletsEarly([][]int{{1, 0, 0}, {0, 1, 0}, {0, 0, 1}}, []int{1, 1, 1}) == true)
	fmt.Println("all tests pass")
}
