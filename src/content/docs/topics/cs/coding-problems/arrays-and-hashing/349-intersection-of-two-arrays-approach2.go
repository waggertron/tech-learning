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

func intersection(nums1 []int, nums2 []int) []int {
	s1 := make(map[int]struct{})
	for _, n := range nums1 {
		s1[n] = struct{}{}
	}
	s2 := make(map[int]struct{})
	for _, n := range nums2 {
		s2[n] = struct{}{}
	}
	result := []int{}
	for n := range s1 {
		if _, ok := s2[n]; ok {
			result = append(result, n)
		}
	}
	return result
}

func sortedInts(s []int) []int {
	cp := make([]int, len(s))
	copy(cp, s)
	for i := 0; i < len(cp); i++ {
		for j := i + 1; j < len(cp); j++ {
			if cp[j] < cp[i] {
				cp[i], cp[j] = cp[j], cp[i]
			}
		}
	}
	return cp
}

func intsEqual(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func runTests() {
	assert(intsEqual(sortedInts(intersection([]int{1, 2, 2, 1}, []int{2, 2})), []int{2}), "test 1")
	assert(intsEqual(sortedInts(intersection([]int{4, 9, 5}, []int{9, 4, 9, 8, 4})), []int{4, 9}), "test 2")
	assert(len(intersection([]int{1, 2, 3}, []int{4, 5, 6})) == 0, "test 3")
	assert(intsEqual(sortedInts(intersection([]int{1, 1, 1}, []int{1, 1, 1})), []int{1}), "test 4")
	fmt.Println("all tests pass")
}

func main() { runTests() }
