package main

import "fmt"

func rotate(nums []int, k int) {
}

func main() {
	nums1 := []int{1, 2, 3, 4, 5, 6, 7}
	rotate(nums1, 3)
	fmt.Println(nums1) // [5 6 7 1 2 3 4]

	nums2 := []int{-1, -100, 3, 99}
	rotate(nums2, 2)
	fmt.Println(nums2) // [3 99 -1 -100]
}
