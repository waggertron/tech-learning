package main

import (
	"fmt"
	"math"
)

func myPow(x float64, n int) float64 {
	if n < 0 {               // L1: O(1)
		x = 1 / x            // L2: O(1)
		n = -n               // L3: O(1)
	}
	result := 1.0            // L4: O(1)
	for n != 0 {             // L5: loop log n times
		if n&1 == 1 {
			result *= x      // L6: O(1), multiply in if odd bit
		}
		x *= x               // L7: O(1), square x each iteration
		n >>= 1              // L8: O(1), shift to next bit
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
	assert(math.Abs(myPow(2.0, 10)-1024.0) < 1e-9)
	assert(math.Abs(myPow(2.0, -2)-0.25) < 1e-9)
	assert(math.Abs(myPow(2.0, 0)-1.0) < 1e-9)
	assert(math.Abs(myPow(1.0, 1000000)-1.0) < 1e-9)
	assert(math.Abs(myPow(0.0, 5)-0.0) < 1e-9)
	assert(math.Abs(myPow(2.0, 1)-2.0) < 1e-9)
	fmt.Println("all tests pass")
}

func main() { runTests() }
