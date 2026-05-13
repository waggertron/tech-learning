package main

import (
	"fmt"
	"sort"
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
	// TODO: implement
	return nil
}

func runTests() {
	r := letterCombinations("23")
	expected := []string{"ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"}
	sort.Strings(r)
	sort.Strings(expected)
	assert(fmt.Sprint(r) == fmt.Sprint(expected), "letterCombinations(\"23\") failed")

	r2 := letterCombinations("")
	assert(len(r2) == 0, "letterCombinations(\"\") should be empty")

	r3 := letterCombinations("2")
	sort.Strings(r3)
	assert(fmt.Sprint(r3) == fmt.Sprint([]string{"a", "b", "c"}), "letterCombinations(\"2\") failed")

	r4 := letterCombinations("7")
	sort.Strings(r4)
	assert(fmt.Sprint(r4) == fmt.Sprint([]string{"p", "q", "r", "s"}), "letterCombinations(\"7\") failed")

	r5 := letterCombinations("22")
	assert(len(r5) == 9, "letterCombinations(\"22\") should have 9 results")

	fmt.Println("all tests pass")
}

func main() { runTests() }
