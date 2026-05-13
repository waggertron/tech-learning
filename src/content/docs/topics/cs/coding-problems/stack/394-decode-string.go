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

func decodeString(s string) string {
	// TODO: implement
	return ""
}

func runTests() {
	assert(decodeString("3[a]2[bc]") == "aaabcbc")
	assert(decodeString("3[a2[c]]") == "accaccacc")
	assert(decodeString("2[abc]3[cd]ef") == "abcabccdcdcdef")
	fmt.Println("all tests pass")
}

func main() { runTests() }
