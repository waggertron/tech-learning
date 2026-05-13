package main

import (
	"fmt"
	"math"
)

func myPow(x float64, n int) float64 {
	if n < 0 {                           // L1: O(1)
		x = 1 / x                        // L2: O(1)
		n = -n                           // L3: O(1)
	}

	var helper func(base float64, exp int) float64
	helper = func(base float64, exp int) float64 {
		if exp == 0 {
			return 1                     // L4: base case O(1)
		}
		half := helper(base, exp/2)      // L5: recurse on half exponent
		if exp%2 == 0 {
			return half * half           // L6: O(1)
		}
		return half * half * base        // L7: O(1) for odd exp
	}

	return helper(x, n)
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
