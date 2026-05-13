package main

import (
	"container/heap"
	"fmt"
	"sort"
)

type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func minMeetingRooms(intervals [][]int) int {
	if len(intervals) == 0 {
		return 0
	}
	sort.Slice(intervals, func(i, j int) bool {
		return intervals[i][0] < intervals[j][0]
	})
	h := &MinHeap{}
	heap.Init(h)
	for _, iv := range intervals {
		if h.Len() > 0 && (*h)[0] <= iv[0] {
			heap.Pop(h)
		}
		heap.Push(h, iv[1])
	}
	return h.Len()
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
	assert(minMeetingRooms([][]int{{0, 30}, {5, 10}, {15, 20}}) == 2)
	assert(minMeetingRooms([][]int{{7, 10}, {2, 4}}) == 1)
	assert(minMeetingRooms([][]int{{1, 5}}) == 1)
	assert(minMeetingRooms([][]int{}) == 0)
	assert(minMeetingRooms([][]int{{1, 4}, {2, 5}, {3, 6}}) == 3)
	assert(minMeetingRooms([][]int{{0, 5}, {5, 10}, {10, 15}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
