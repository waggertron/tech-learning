package main

import (
	"fmt"
	"math/rand"
)

func findKthLargest(nums []int, k int) int {
	// k-th largest = (n - k)-th smallest (0-indexed)
	arr := make([]int, len(nums))
	copy(arr, nums)
	target := len(arr) - k

	partition := func(lo, hi int) (int, int) {
		pivotIdx := lo + rand.Intn(hi-lo+1)
		pivot := arr[pivotIdx]   // L1: O(1) random pivot
		left, right := lo, hi
		i := lo
		for i <= right { // L2: three-way partition
			if arr[i] < pivot {
				arr[left], arr[i] = arr[i], arr[left]
				left++
				i++
			} else if arr[i] > pivot {
				arr[right], arr[i] = arr[i], arr[right]
				right--
			} else {
				i++
			}
		}
		return left, right // pivot's final range [left, right]
	}

	lo, hi := 0, len(arr)-1
	for {
		if lo == hi {
			return arr[lo]
		}
		l, r := partition(lo, hi) // L3: O(hi - lo) per call
		if l <= target && target <= r {
			return arr[target]
		} else if target < l {
			hi = l - 1
		} else {
			lo = r + 1
		}
	}
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func runTests() {
	assert(findKthLargest([]int{3, 2, 1, 5, 6, 4}, 2) == 5)
	assert(findKthLargest([]int{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4) == 4)
	assert(findKthLargest([]int{1}, 1) == 1)
	assert(findKthLargest([]int{2, 2, 2, 2}, 2) == 2)
	assert(findKthLargest([]int{5, 3, 1, 4, 2}, 5) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
