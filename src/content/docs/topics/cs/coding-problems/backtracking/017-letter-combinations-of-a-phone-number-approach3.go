package main

import (
	"fmt"
	"sort"
	"strings"
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

// letterCombinations uses iterative cartesian product (equivalent to itertools.product).
func letterCombinations(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}
	mapping := map[byte]string{
		'2': "abc", '3': "def", '4': "ghi", '5': "jkl",
		'6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz",
	}
	result := []string{""}
	for i := 0; i < len(digits); i++ { // L1: loop over n digits
		letters := mapping[digits[i]]
		next := []string{}
		for _, prefix := range result {
			for _, ch := range letters {
				next = append(next, prefix+string(ch)) // L1: O(k^n * n) total
			}
		}
		result = next
	}
	return result
}

func runTests() {
	r := letterCombinations("23")
	expected := []string{"ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"}
	sort.Strings(r)
	sort.Strings(expected)
	assert(strings.Join(r, ",") == strings.Join(expected, ","), "letterCombinations(\"23\") failed")

	r2 := letterCombinations("")
	assert(len(r2) == 0, "letterCombinations(\"\") should be empty")

	r3 := letterCombinations("2")
	sort.Strings(r3)
	assert(strings.Join(r3, ",") == "a,b,c", "letterCombinations(\"2\") failed")

	r4 := letterCombinations("7")
	sort.Strings(r4)
	assert(strings.Join(r4, ",") == "p,q,r,s", "letterCombinations(\"7\") failed")

	r5 := letterCombinations("22")
	assert(len(r5) == 9, "letterCombinations(\"22\") should have 9 results")

	fmt.Println("all tests pass")
}

func main() { runTests() }
