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

var memo = map[int]int{}

func climbStairs(n int) int {
	if n <= 2 {
		return n
	}
	if v, ok := memo[n]; ok {
		return v
	}
	result := climbStairs(n-1) + climbStairs(n-2)
	memo[n] = result
	return result
}

func runTests() {
	assert(climbStairs(1) == 1)
	assert(climbStairs(2) == 2)
	assert(climbStairs(3) == 3)
	assert(climbStairs(4) == 5)
	assert(climbStairs(5) == 8)
	assert(climbStairs(10) == 89)
	fmt.Println("all tests pass")
}

func main() { runTests() }
