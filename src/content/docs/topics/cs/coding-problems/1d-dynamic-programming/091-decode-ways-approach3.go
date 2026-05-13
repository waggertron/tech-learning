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

func numDecodings(s string) int {
	if len(s) == 0 || s[0] == '0' {
		return 0
	}
	prev2, prev1 := 1, 1
	for i := 1; i < len(s); i++ {
		cur := 0
		if s[i] != '0' {
			cur += prev1
		}
		two, _ := strconv.Atoi(s[i-1 : i+1])
		if two >= 10 && two <= 26 {
			cur += prev2
		}
		prev2, prev1 = prev1, cur
	}
	return prev1
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
