package main

import "fmt"

func rotate(nums []int, k int) {
	n := len(nums)
	k %= n
	count := 0
	for start := 0; count < n; start++ {
		current := start
		prev := nums[start]
		for {
			next := (current + k) % n
			nums[next], prev = prev, nums[next]
			current = next
			count++
			if start == current {
				break
			}
		}
	}
}

func main() {
	nums1 := []int{1, 2, 3, 4, 5, 6, 7}
	rotate(nums1, 3)
	fmt.Println(nums1) // [5 6 7 1 2 3 4]
}
