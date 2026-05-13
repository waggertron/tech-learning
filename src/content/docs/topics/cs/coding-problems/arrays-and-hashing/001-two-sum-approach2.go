package main

import (
	"fmt"
	"sort"
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

type indexedVal struct {
	idx int
	val int
}

func twoSum(nums []int, target int) []int {
	indexed := make([]indexedVal, len(nums))
	for i, v := range nums {
		indexed[i] = indexedVal{i, v}
	}
	sort.Slice(indexed, func(i, j int) bool { return indexed[i].val < indexed[j].val })
	l, r := 0, len(indexed)-1
	for l < r {
		s := indexed[l].val + indexed[r].val
		if s == target {
			result := []int{indexed[l].idx, indexed[r].idx}
			sort.Ints(result)
			return result
		}
		if s < target {
			l++
		} else {
			r--
		}
	}
	return []int{}
}

func runTests() {
	assert(fmt.Sprint(twoSum([]int{2, 7, 11, 15}, 9)) == fmt.Sprint([]int{0, 1}), "test 1")
	assert(fmt.Sprint(twoSum([]int{3, 2, 4}, 6)) == fmt.Sprint([]int{1, 2}), "test 2")
	assert(fmt.Sprint(twoSum([]int{3, 3}, 6)) == fmt.Sprint([]int{0, 1}), "test 3")
	assert(fmt.Sprint(twoSum([]int{1, 2, 3, 4, 5}, 9)) == fmt.Sprint([]int{3, 4}), "test 4")
	assert(fmt.Sprint(twoSum([]int{0, 4}, 4)) == fmt.Sprint([]int{0, 1}), "test 5")
	fmt.Println("all tests pass")
}

func main() { runTests() }
