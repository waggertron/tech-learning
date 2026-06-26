package main

import "fmt"

func reverse(nums []int, lo, hi int) {
	for lo < hi {
		nums[lo], nums[hi] = nums[hi], nums[lo]
		lo++
		hi--
	}
}

func rotate(nums []int, k int) {
	n := len(nums)
	k %= n
	reverse(nums, 0, n-1) // whole array reversed
	reverse(nums, 0, k-1) // fix first k
	reverse(nums, k, n-1) // fix the rest
}

func main() {
	nums1 := []int{1, 2, 3, 4, 5, 6, 7}
	rotate(nums1, 3)
	fmt.Println(nums1) // [5 6 7 1 2 3 4]
}
