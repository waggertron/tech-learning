package main

import (
	"container/heap"
	"fmt"
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

type pair struct{ cnt, num int }
type minHeap []pair

func (h minHeap) Len() int            { return len(h) }
func (h minHeap) Less(i, j int) bool  { return h[i].cnt < h[j].cnt }
func (h minHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *minHeap) Push(x interface{}) { *h = append(*h, x.(pair)) }
func (h *minHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func topKFrequent(nums []int, k int) []int {
	counts := make(map[int]int)
	for _, n := range nums {
		counts[n]++
	}
	h := &minHeap{}
	heap.Init(h)
	for num, cnt := range counts {
		heap.Push(h, pair{cnt, num})
		if h.Len() > k {
			heap.Pop(h)
		}
	}
	result := make([]int, h.Len())
	for i := range result {
		result[i] = (*h)[i].num
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
