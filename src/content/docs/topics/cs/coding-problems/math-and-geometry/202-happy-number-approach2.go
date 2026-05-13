package main

import "fmt"

func isHappy(n int) bool {
	nextN := func(x int) int {
		total := 0
		for x != 0 {                    // L1: O(log x) digit extraction
			d := x % 10
			total += d * d
			x /= 10
		}
		return total
	}

	slow, fast := n, n
	for {
		slow = nextN(slow)              // L2: one step
		fast = nextN(nextN(fast))       // L3: two steps
		if fast == 1 {
			return true                 // L4: happy
		}
		if slow == fast {
			return false                // L5: cycle detected
		}
	}
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
	assert(isHappy(19) == true)
	assert(isHappy(2) == false)
	assert(isHappy(1) == true)
	assert(isHappy(7) == true)
	assert(isHappy(4) == false)
	assert(isHappy(100) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
