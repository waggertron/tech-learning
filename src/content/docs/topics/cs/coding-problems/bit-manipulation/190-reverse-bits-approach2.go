package main

import (
	"fmt"
	"strconv"
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

func reverseBits(n uint32) uint32 {
	s := fmt.Sprintf("%032b", n)               // L1: O(32) format to binary string
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i] // L2: O(32) reverse
	}
	val, _ := strconv.ParseUint(string(runes), 2, 32) // L3: O(32) parse
	return uint32(val)
}

func main() {
	assert(reverseBits(43261596) == 964176192)
	assert(reverseBits(4294967293) == 3221225471)
	assert(reverseBits(0) == 0)
	assert(reverseBits(4294967295) == 4294967295)
	assert(reverseBits(1) == 2147483648)
	fmt.Println("all tests pass")
}
