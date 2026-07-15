package main

import "fmt"

func assert(condition bool, message string) {
	if !condition {
		panic(message)
	}
}

func search(nums []int, target int) int {
	left, right := 0, len(nums)-1
	for left <= right {
		middle := left + (right-left)/2
		if nums[middle] == target {
			return middle
		}
		if nums[middle] < target {
			left = middle + 1
		} else {
			right = middle - 1
		}
	}
	return -1
}

func runTests() {
	// TEST_VECTORS_BEGIN sha256:936f285301e724f71bb2514961a2e454bf17572a4553be66fe381c85e315c253
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 9) == 4, "target-present-middle")
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 2) == -1, "target-absent")
	assert(search([]int{5}, 5) == 0, "single-element-found")
	assert(search([]int{5}, 3) == -1, "single-element-missing")
	assert(search([]int{-1, 0, 3, 5, 9, 12}, -1) == 0, "first-element")
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 12) == 5, "last-element")
	// EXCLUDED_VECTOR empty-array: [[],4] | The LeetCode contract requires at least one array element.
	// EXCLUDED_VECTOR unsorted-array: [[3,1,2],1] | Binary search requires the input array to be sorted in ascending order.
	// EXCLUDED_VECTOR duplicate-values: [[1,1,2],1] | LeetCode 704 states that every array value is unique.
	// TEST_VECTORS_END
	fmt.Println("All shared test vectors passed")
}

func main() { runTests() }
