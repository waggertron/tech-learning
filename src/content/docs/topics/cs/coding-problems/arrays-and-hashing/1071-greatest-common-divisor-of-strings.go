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

func gcdOfStrings(str1 string, str2 string) string {
	// TODO: implement
	return ""
}

func runTests() {
	assert(gcdOfStrings("ABCABC", "ABC") == "ABC", "test 1")
	assert(gcdOfStrings("ABABAB", "ABAB") == "AB", "test 2")
	assert(gcdOfStrings("LEET", "CODE") == "", "test 3")
	assert(gcdOfStrings("AAAAAB", "AAA") == "", "test 4")
	assert(gcdOfStrings("A", "A") == "A", "test 5")
	assert(gcdOfStrings("AAAA", "AA") == "AA", "test 6")
	fmt.Println("all tests pass")
}

func main() { runTests() }
