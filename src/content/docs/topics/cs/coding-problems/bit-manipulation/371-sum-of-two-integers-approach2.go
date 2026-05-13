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

func getSum(a int, b int) int {
	const MASK = 0xFFFFFFFF
	const MAX_INT = 0x7FFFFFFF
	for b != 0 {                                         // L1: loop at most 32 times
		carry := (a & b) << 1                            // L2a: O(1), compute carry
		a = (a ^ b) & MASK                               // L2b: O(1), sum without carry
		b = carry & MASK
	}
	a &= MASK
	if a <= MAX_INT {                                    // L3: O(1) sign correction
		return a
	}
	return int(int32(a)) // reinterpret as signed 32-bit
}

func main() {
	assert(getSum(1, 2) == 3)
	assert(getSum(2, 3) == 5)
	assert(getSum(0, 0) == 0)
	assert(getSum(-1, 1) == 0)
	assert(getSum(-5, 3) == -2)
	fmt.Println("all tests pass")
}
