package main

import (
	"fmt"
	"strconv"
)

func multiply(num1 string, num2 string) string {
	if num1 == "0" || num2 == "0" {              // L1: O(1) early exit
		return "0"
	}
	n, m := len(num1), len(num2)                 // L2: O(1)
	result := make([]int, n+m)                   // L3: O(n + m)
	for i := n - 1; i >= 0; i-- {               // L4: outer loop, n iterations
		for j := m - 1; j >= 0; j-- {           // L5: inner loop, m iterations
			d1 := int(num1[i] - '0')
			d2 := int(num2[j] - '0')
			prod := d1 * d2                      // L6: O(1)
			p1, p2 := i+j, i+j+1                // L7: O(1)
			total := prod + result[p2]           // L8: O(1)
			result[p2] = total % 10              // L9: O(1)
			result[p1] += total / 10             // L10: O(1)
		}
	}
	start := 0
	for start < len(result) && result[start] == 0 {
		start++                                  // L11: O(n + m)
	}
	out := ""
	for _, d := range result[start:] {
		out += strconv.Itoa(d)                   // L12: O(n + m)
	}
	return out
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
	assert(multiply("2", "3") == "6")
	assert(multiply("123", "456") == "56088")
	assert(multiply("0", "12345") == "0")
	assert(multiply("99", "99") == "9801")
	assert(multiply("1", "1") == "1")
	assert(multiply("9999", "9999") == "99980001")
	fmt.Println("all tests pass")
}

func main() { runTests() }
