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

func isPalindrome(s string) bool {
	cleaned := []rune{}
	for _, ch := range s {
		if unicode.IsLetter(ch) || unicode.IsDigit(ch) {
			cleaned = append(cleaned, unicode.ToLower(ch))
		}
	}
	l, r := 0, len(cleaned)-1
	for l < r {
		if cleaned[l] != cleaned[r] {
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
