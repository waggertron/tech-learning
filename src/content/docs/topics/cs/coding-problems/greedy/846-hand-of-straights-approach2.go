package main

import (
	"fmt"
	"sort"
)

func isNStraightHand(hand []int, groupSize int) bool {
	if len(hand)%groupSize != 0 {
		return false
	}
	counts := make(map[int]int)
	for _, v := range hand {
		counts[v]++
	}
	keys := make([]int, 0, len(counts))
	for k := range counts {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	for _, x := range keys {
		c := counts[x]
		if c == 0 {
			continue
		}
		for k := 0; k < groupSize; k++ {
			if counts[x+k] < c {
				return false
			}
			counts[x+k] -= c
		}
	}
	return true
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(isNStraightHand([]int{1, 2, 3, 6, 2, 3, 4, 7, 8}, 3) == true)
	assert(isNStraightHand([]int{1, 2, 3, 4, 5}, 4) == false)
	assert(isNStraightHand([]int{1}, 1) == true)
	assert(isNStraightHand([]int{1, 2, 3}, 3) == true)
	assert(isNStraightHand([]int{1, 2, 4}, 3) == false)
	assert(isNStraightHand([]int{1, 1, 2, 2, 3, 3}, 3) == true)
	fmt.Println("all tests pass")
}
