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

func leastInterval(tasks []byte, n int) int {
	// TODO: implement
	return 0
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
