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

func isPalindrome(s string) bool {
	// TODO: implement
	return false
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
