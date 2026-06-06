package main

import "fmt"

func increasingTriplet(nums []int) bool {
	n := len(nums)
	if n < 3 {
		return false
	}
	minLeft := make([]int, n)
	maxRight := make([]int, n)
	minLeft[0] = nums[0]
	for i := 1; i < n; i++ {
		if nums[i] < minLeft[i-1] {
			minLeft[i] = nums[i]
		} else {
			minLeft[i] = minLeft[i-1]
		}
	}
	maxRight[n-1] = nums[n-1]
	for i := n - 2; i >= 0; i-- {
		if nums[i] > maxRight[i+1] {
			maxRight[i] = nums[i]
		} else {
			maxRight[i] = maxRight[i+1]
		}
	}
	for j := 1; j < n-1; j++ {
		if minLeft[j-1] < nums[j] && nums[j] < maxRight[j+1] {
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
