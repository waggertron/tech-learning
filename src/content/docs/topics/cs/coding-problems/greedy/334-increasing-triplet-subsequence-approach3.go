package main

import (
	"fmt"
	"math"
)

func increasingTriplet(nums []int) bool {
	first, second := math.MaxInt, math.MaxInt
	for _, n := range nums {
		if n <= first {
			first = n
		} else if n <= second {
			second = n
		} else {
			return true
		}
	}
	return false
}

func main() {
	if !increasingTriplet([]int{1, 2, 3, 4, 5}) {
		panic("failed")
	}
	if increasingTriplet([]int{5, 4, 3, 2, 1}) {
		panic("failed")
	}
	if !increasingTriplet([]int{2, 1, 5, 0, 4, 6}) {
		panic("failed")
	}
	if increasingTriplet([]int{1, 2}) {
		panic("failed")
	}
	if increasingTriplet([]int{1, 1, 1, 1, 1}) {
		panic("failed")
	}
	if !increasingTriplet([]int{20, 100, 10, 12, 5, 13}) {
		panic("failed")
	}
	fmt.Println("all tests pass")
}
