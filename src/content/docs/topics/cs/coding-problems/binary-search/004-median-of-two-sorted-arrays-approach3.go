package main

import (
	"fmt"
	"math"
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

func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
	if len(nums1) > len(nums2) {
		nums1, nums2 = nums2, nums1
	}
	m, n := len(nums1), len(nums2)
	half := (m + n + 1) / 2

	lo, hi := 0, m
	for lo <= hi {
		i := (lo + hi) / 2
		j := half - i

		var aLeft, aRight, bLeft, bRight float64
		if i > 0 {
			aLeft = float64(nums1[i-1])
		} else {
			aLeft = math.Inf(-1)
		}
		if i < m {
			aRight = float64(nums1[i])
		} else {
			aRight = math.Inf(1)
		}
		if j > 0 {
			bLeft = float64(nums2[j-1])
		} else {
			bLeft = math.Inf(-1)
		}
		if j < n {
			bRight = float64(nums2[j])
		} else {
			bRight = math.Inf(1)
		}

		if aLeft <= bRight && bLeft <= aRight {
			if (m+n)%2 == 1 {
				return math.Max(aLeft, bLeft)
			}
			return (math.Max(aLeft, bLeft) + math.Min(aRight, bRight)) / 2
		} else if aLeft > bRight {
			hi = i - 1
		} else {
			lo = i + 1
		}
	}
	return 0
}

func runTests() {
	assert(findMedianSortedArrays([]int{1, 3}, []int{2}) == 2.0)
	assert(findMedianSortedArrays([]int{1, 2}, []int{3, 4}) == 2.5)
	assert(findMedianSortedArrays([]int{0, 0}, []int{0, 0}) == 0.0)
	assert(findMedianSortedArrays([]int{}, []int{1}) == 1.0)
	assert(findMedianSortedArrays([]int{2}, []int{}) == 2.0)
	assert(findMedianSortedArrays([]int{1, 3}, []int{2, 4}) == 2.5)
	fmt.Println("all tests pass")
}

func main() { runTests() }
