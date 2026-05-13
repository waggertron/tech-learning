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

func reverseBits(n uint32) uint32 {
	// TODO: implement
	return 0
}

func runTests() {
	assert(reverseBits(43261596) == 964176192)
	assert(reverseBits(4294967293) == 3221225471)
	assert(reverseBits(0) == 0)
	assert(reverseBits(4294967295) == 4294967295)
	assert(reverseBits(1) == 2147483648)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
