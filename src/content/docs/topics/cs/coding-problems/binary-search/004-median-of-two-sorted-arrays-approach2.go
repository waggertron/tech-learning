package main

import "fmt"

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
	m, n := len(nums1), len(nums2)
	total := m + n
	need := total/2 + 1

	i, j := 0, 0
	prev, cur := 0, 0
	for k := 0; k < need; k++ {
		prev = cur
		if i < m && (j >= n || nums1[i] <= nums2[j]) {
			cur = nums1[i]
			i++
		} else {
			cur = nums2[j]
			j++
		}
	}

	if total%2 == 1 {
		return float64(cur)
	}
	return float64(prev+cur) / 2
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
