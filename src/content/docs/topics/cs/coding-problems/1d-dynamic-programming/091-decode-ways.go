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

func numDecodings(s string) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(numDecodings("12") == 2)
	assert(numDecodings("226") == 3)
	assert(numDecodings("06") == 0)
	assert(numDecodings("0") == 0)
	assert(numDecodings("1") == 1)
	assert(numDecodings("11106") == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
