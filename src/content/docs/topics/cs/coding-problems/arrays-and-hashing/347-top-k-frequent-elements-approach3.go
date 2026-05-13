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

func topKFrequent(nums []int, k int) []int {
	counts := make(map[int]int)
	for _, n := range nums {
		counts[n]++
	}
	buckets := make([][]int, len(nums)+1)
	for num, cnt := range counts {
		buckets[cnt] = append(buckets[cnt], num)
	}
	result := []int{}
	for cnt := len(buckets) - 1; cnt > 0; cnt-- {
		for _, num := range buckets[cnt] {
			result = append(result, num)
			if len(result) == k {
				return result
			}
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

func contains(s []int, v int) bool {
	for _, x := range s {
		if x == v {
			return true
		}
	}
	return false
}

func runTests() {
	assert(intsEqual(sortedInts(topKFrequent([]int{1, 1, 1, 2, 2, 3}, 2)), []int{1, 2}), "test 1")
	assert(intsEqual(topKFrequent([]int{1}, 1), []int{1}), "test 2")
	assert(intsEqual(sortedInts(topKFrequent([]int{1, 2}, 2)), []int{1, 2}), "test 3")
	r := topKFrequent([]int{1, 2, 3}, 1)
	assert(len(r) == 1 && contains([]int{1, 2, 3}, r[0]), "test 4")
	fmt.Println("all tests pass")
}

func main() { runTests() }
