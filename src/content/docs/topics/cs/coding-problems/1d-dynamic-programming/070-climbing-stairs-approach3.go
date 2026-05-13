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

func climbStairs(n int) int {
	if n <= 2 {
		return n
	}
	dp := make([]int, n+1)
	dp[1] = 1
	dp[2] = 2
	for i := 3; i <= n; i++ {
		dp[i] = dp[i-1] + dp[i-2]
	}
	return dp[n]
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
