package main

import (
	"fmt"
	"math"
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

func myPow(x float64, n int) float64 {
	// TODO: implement
	return 0
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
