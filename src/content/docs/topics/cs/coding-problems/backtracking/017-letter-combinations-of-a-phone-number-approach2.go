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

func letterCombinations(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}
	mapping := map[byte]string{
		'2': "abc", '3': "def", '4': "ghi", '5': "jkl",
		'6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz",
	}
	result := []string{}
	path := []byte{}

	var backtrack func(i int)
	backtrack = func(i int) {
		if i == len(digits) {
			result = append(result, string(path)) // L1: O(n) join when complete
			return
		}
		for _, ch := range mapping[digits[i]] { // L2: loop over letters for digit i
			path = append(path, byte(ch)) // L3: O(1) push
			backtrack(i + 1)              // L4: recurse
			path = path[:len(path)-1]     // L5: O(1) pop
		}
	}

	backtrack(0)
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
