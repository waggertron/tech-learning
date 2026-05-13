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

func hammingWeight(n uint32) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(hammingWeight(11) == 3)
	assert(hammingWeight(128) == 1)
	assert(hammingWeight(0) == 0)
	assert(hammingWeight(4294967295) == 32)
	assert(hammingWeight(1) == 1)
	assert(hammingWeight(183) == 6)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
