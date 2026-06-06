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

func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}

func gcdOfStrings(str1 string, str2 string) string {
	if str1+str2 != str2+str1 {
		return ""
	}
	return str1[:gcd(len(str1), len(str2))]
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
