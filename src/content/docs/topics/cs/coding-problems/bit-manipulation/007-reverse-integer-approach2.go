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

const intMin = -1 << 31
const intMax = 1<<31 - 1

func reverse(x int) int {
	sign := 1
	if x < 0 {
		sign = -1
		x = -x
	}
	result := 0
	for x != 0 {                                   // L3: loop d times (d = digits)
		digit := x % 10                            // L4: O(1)
		x /= 10                                    // L5: O(1)
		if sign == 1 && (result > intMax/10 || (result == intMax/10 && digit > 7)) {
			return 0                                // L6: O(1) overflow guard
		}
		if sign == -1 && (result > (-intMin)/10 || (result == (-intMin)/10 && digit > 8)) {
			return 0                                // L7: O(1) overflow guard
		}
		result = result*10 + digit                 // L8: O(1)
	}
	return sign * result
}

func main() {
	assert(reverse(123) == 321)
	assert(reverse(-123) == -321)
	assert(reverse(120) == 21)
	assert(reverse(0) == 0)
	assert(reverse(1<<31-1) == 0)
	assert(reverse(1534236469) == 0)
	fmt.Println("all tests pass")
}
