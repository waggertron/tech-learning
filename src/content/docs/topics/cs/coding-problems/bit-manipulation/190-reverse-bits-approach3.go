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
	n = (n >> 16) | (n << 16)                                    // L1: swap 16-bit halves
	n = ((n & 0xFF00FF00) >> 8) | ((n & 0x00FF00FF) << 8)       // L2: swap bytes
	n = ((n & 0xF0F0F0F0) >> 4) | ((n & 0x0F0F0F0F) << 4)       // L3: swap nibbles
	n = ((n & 0xCCCCCCCC) >> 2) | ((n & 0x33333333) << 2)       // L4: swap pairs
	n = ((n & 0xAAAAAAAA) >> 1) | ((n & 0x55555555) << 1)       // L5: swap individual bits
	return n
}

func main() {
	assert(reverseBits(43261596) == 964176192)
	assert(reverseBits(4294967293) == 3221225471)
	assert(reverseBits(0) == 0)
	assert(reverseBits(4294967295) == 4294967295)
	assert(reverseBits(1) == 2147483648)
	fmt.Println("all tests pass")
}
