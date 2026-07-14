package main

import (
	"fmt"
	"reflect"
)

func summaryRanges(nums []int) []string {
	// TODO: implement
	return nil
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

	// Maximum valid input length, one consecutive range.
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
