package main

import (
	"container/heap"
	"fmt"
	"reflect"
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

// maxHeap stores [-value, index] pairs; smallest negated value = largest actual value.
type maxHeap [][2]int

func (h maxHeap) Len() int            { return len(h) }
func (h maxHeap) Less(i, j int) bool  { return h[i][0] < h[j][0] }
func (h maxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *maxHeap) Push(x interface{}) { *h = append(*h, x.([2]int)) }
func (h *maxHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func maxSlidingWindow(nums []int, k int) []int {
	h := &maxHeap{}
	result := []int{}
	for i, x := range nums {
		heap.Push(h, [2]int{-x, i})
		if i >= k-1 {
			for (*h)[0][1] <= i-k {
				heap.Pop(h)
			}
			result = append(result, -(*h)[0][0])
		}
	}
	return result
}

func runTests() {
	assert(reflect.DeepEqual(maxSlidingWindow([]int{1, 3, -1, -3, 5, 3, 6, 7}, 3), []int{3, 3, 5, 5, 6, 7}))
	assert(reflect.DeepEqual(maxSlidingWindow([]int{1}, 1), []int{1}))
	assert(reflect.DeepEqual(maxSlidingWindow([]int{1, -1}, 1), []int{1, -1}))
	assert(reflect.DeepEqual(maxSlidingWindow([]int{9, 8, 7, 6, 5}, 3), []int{9, 8, 7}))
	assert(reflect.DeepEqual(maxSlidingWindow([]int{1, 2, 3, 4, 5}, 3), []int{3, 4, 5}))
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
