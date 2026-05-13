package main

import "fmt"

func kClosest(points [][]int, k int) [][]int {
	arr := make([][]int, len(points))
	for i, p := range points {
		arr[i] = []int{p[0], p[1]}
	}

	dist := func(p []int) int { return p[0]*p[0] + p[1]*p[1] }

	var partition func(lo, hi int) int
	partition = func(lo, hi int) int { // L1: O(hi - lo) per call
		pivot := dist(arr[hi])
		store := lo
		for i := lo; i < hi; i++ {
			if dist(arr[i]) <= pivot {
				arr[store], arr[i] = arr[i], arr[store]
				store++
			}
		}
		arr[store], arr[hi] = arr[hi], arr[store]
		return store
	}

	var quickselect func(lo, hi, k int)
	quickselect = func(lo, hi, k int) {
		if lo >= hi { // L2: base case
			return
		}
		p := partition(lo, hi) // L3: O(subarray size)
		if p == k {
			return
		}
		if p < k {
			quickselect(p+1, hi, k) // L4: recurse right
		} else {
			quickselect(lo, p-1, k) // L5: recurse left
		}
	}

	quickselect(0, len(arr)-1, k)
	return arr[:k]
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
	result := kClosest([][]int{{1, 3}, {-2, 2}}, 1)
	assert(len(result) == 1)

	result2 := kClosest([][]int{{3, 3}, {5, -1}, {-2, 4}}, 2)
	assert(len(result2) == 2)

	result3 := kClosest([][]int{{0, 0}}, 1)
	assert(len(result3) == 1 && result3[0][0] == 0 && result3[0][1] == 0)

	result4 := kClosest([][]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}, 2)
	assert(len(result4) == 2)

	result5 := kClosest([][]int{{1, 2}, {3, 4}, {0, 0}}, 3)
	assert(len(result5) == 3)

	fmt.Println("all tests pass")
}

func main() { runTests() }
