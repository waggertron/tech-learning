package main

import (
	"fmt"
	"reflect"
	"strconv"
)

func summaryRanges(nums []int) []string {
	if len(nums) == 0 {
		return []string{}
	}

	ranges := make([]string, 0)
	start := nums[0]

	for i := 1; i <= len(nums); i++ {
		if i < len(nums) && nums[i] == nums[i-1]+1 {
			continue
		}

		end := nums[i-1]
		if start == end {
			ranges = append(ranges, strconv.Itoa(start))
		} else {
			ranges = append(ranges, strconv.Itoa(start)+"->"+strconv.Itoa(end))
		}

		if i < len(nums) {
			start = nums[i]
		}
	}

	return ranges
}

func assertEqual(actual, expected []string, name string) {
	if !reflect.DeepEqual(actual, expected) {
		panic(fmt.Sprintf("%s: got %v, want %v", name, actual, expected))
	}
}

func runTests() {
	assertEqual(summaryRanges([]int{0, 1, 2, 4, 5, 7}), []string{"0->2", "4->5", "7"}, "example 1")
	assertEqual(summaryRanges([]int{0, 2, 3, 4, 6, 8, 9}), []string{"0", "2->4", "6", "8->9"}, "example 2")
	assertEqual(summaryRanges([]int{}), []string{}, "empty input")
	assertEqual(summaryRanges([]int{5}), []string{"5"}, "singleton")
	assertEqual(summaryRanges([]int{-3, -2, -1, 1, 3, 4}), []string{"-3->-1", "1", "3->4"}, "negative values")

	minimum := -2147483648
	maximum := 2147483647
	assertEqual(
		summaryRanges([]int{minimum, minimum + 1, -1, 0, 1, maximum}),
		[]string{"-2147483648->-2147483647", "-1->1", "2147483647"},
		"32-bit boundaries",
	)

	maximumLength := make([]int, 20)
	for i := range maximumLength {
		maximumLength[i] = i - 10
	}
	assertEqual(summaryRanges(maximumLength), []string{"-10->9"}, "maximum length")
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
