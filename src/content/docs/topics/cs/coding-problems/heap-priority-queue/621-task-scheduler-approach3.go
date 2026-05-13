package main

import "fmt"

func leastInterval(tasks []byte, n int) int {
	freq := make(map[byte]int)
	for _, t := range tasks { // L1: O(T) build counter
		freq[t]++
	}

	maxCount := 0
	for _, c := range freq { // L2: O(t) find max
		if c > maxCount {
			maxCount = c
		}
	}

	ties := 0
	for _, c := range freq { // L3: O(t) count ties
		if c == maxCount {
			ties++
		}
	}

	result := (maxCount-1)*(n+1) + ties // L4: O(1) formula
	if len(tasks) > result {
		return len(tasks)
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

func runTests() {
	assert(leastInterval([]byte{'A', 'A', 'A', 'B', 'B', 'B'}, 2) == 8)
	assert(leastInterval([]byte{'A', 'A', 'A', 'B', 'B', 'B'}, 0) == 6)
	assert(leastInterval([]byte{'A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'}, 2) == 16)
	assert(leastInterval([]byte{'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'}, 2) == 8)
	assert(leastInterval([]byte{'A', 'A', 'A'}, 3) == 9)
	assert(leastInterval([]byte{'A', 'A', 'A'}, 0) == 3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
