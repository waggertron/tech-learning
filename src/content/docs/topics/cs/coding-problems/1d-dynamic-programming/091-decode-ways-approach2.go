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
	memo := map[int]int{}
	var f func(i int) int
	f = func(i int) int {
		if i == len(s) {
			return 1
		}
		if s[i] == '0' {
			return 0
		}
		if v, ok := memo[i]; ok {
			return v
		}
		ways := f(i + 1)
		if i+1 < len(s) {
			two, _ := strconv.Atoi(s[i : i+2])
			if two >= 10 && two <= 26 {
				ways += f(i + 2)
			}
		}
		memo[i] = ways
		return ways
	}
	return f(0)
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
