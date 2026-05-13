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

func minEatingSpeed(piles []int, h int) int {
	hours := func(k int) int {
		total := 0
		for _, p := range piles {
			total += (p + k - 1) / k
		}
		return total
	}

	lo, hi := 1, 0
	for _, p := range piles {
		if p > hi {
			hi = p
		}
	}
	for lo < hi {
		mid := (lo + hi) / 2
		if hours(mid) <= h {
			hi = mid
		} else {
			lo = mid + 1
		}
	}
	return lo
}

func runTests() {
	assert(minEatingSpeed([]int{3, 6, 7, 11}, 8) == 4)
	assert(minEatingSpeed([]int{30, 11, 23, 4, 20}, 5) == 30)
	assert(minEatingSpeed([]int{30, 11, 23, 4, 20}, 6) == 23)
	assert(minEatingSpeed([]int{1}, 1) == 1)
	assert(minEatingSpeed([]int{1000000000}, 2) == 500000000)
	fmt.Println("all tests pass")
}

func main() { runTests() }
