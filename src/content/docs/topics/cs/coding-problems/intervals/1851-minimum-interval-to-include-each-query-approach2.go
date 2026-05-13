package main

import (
	"container/heap"
	"fmt"
	"sort"
)

type entry struct {
	length int
	end    int
}

type MinHeap []entry

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i].length < h[j].length }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)        { *h = append(*h, x.(entry)) }
func (h *MinHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func minInterval(intervals [][]int, queries []int) []int {
	sort.Slice(intervals, func(i, j int) bool {
		return intervals[i][0] < intervals[j][0]
	})
	type indexedQuery struct {
		val int
		idx int
	}
	sortedQueries := make([]indexedQuery, len(queries))
	for i, q := range queries {
		sortedQueries[i] = indexedQuery{q, i}
	}
	sort.Slice(sortedQueries, func(i, j int) bool {
		return sortedQueries[i].val < sortedQueries[j].val
	})

	result := make([]int, len(queries))
	h := &MinHeap{}
	heap.Init(h)
	i := 0
	for _, iq := range sortedQueries {
		q := iq.val
		for i < len(intervals) && intervals[i][0] <= q {
			s, e := intervals[i][0], intervals[i][1]
			heap.Push(h, entry{e - s + 1, e})
			i++
		}
		for h.Len() > 0 && (*h)[0].end < q {
			heap.Pop(h)
		}
		if h.Len() > 0 {
			result[iq.idx] = (*h)[0].length
		} else {
			result[iq.idx] = -1
		}
	}
	return result
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

func slicesEqual(a, b []int) bool {
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
	assert(slicesEqual(minInterval([][]int{{1, 4}, {2, 4}, {3, 6}, {4, 4}}, []int{2, 3, 4, 5}), []int{3, 3, 1, 4}))
	assert(slicesEqual(minInterval([][]int{{2, 3}, {2, 5}, {1, 8}, {20, 25}}, []int{2, 19, 5, 22}), []int{2, -1, 4, 6}))
	assert(slicesEqual(minInterval([][]int{{1, 3}}, []int{5}), []int{-1}))
	assert(slicesEqual(minInterval([][]int{{1, 10}}, []int{5}), []int{10}))
	assert(slicesEqual(minInterval([][]int{{1, 5}, {2, 3}}, []int{2, 3}), []int{2, 2}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
