package main

import (
	"fmt"
	"unicode"
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

func isAlnum(ch rune) bool {
	return unicode.IsLetter(ch) || unicode.IsDigit(ch)
}

func isPalindrome(s string) bool {
	runes := []rune(s)
	l, r := 0, len(runes)-1
	for l < r {
		for l < r && !isAlnum(runes[l]) {
			l++
		}
		for l < r && !isAlnum(runes[r]) {
			r--
		}
		if unicode.ToLower(runes[l]) != unicode.ToLower(runes[r]) {
			return false
		}
		l++
		r--
	}
	return true
}

func runTests() {
	assert(isPalindrome("A man, a plan, a canal: Panama") == true)
	assert(isPalindrome("race a car") == false)
	assert(isPalindrome(" ") == true)
	assert(isPalindrome("") == true)
	assert(isPalindrome("a") == true)
	assert(isPalindrome("aa") == true)
	assert(isPalindrome("ab") == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
