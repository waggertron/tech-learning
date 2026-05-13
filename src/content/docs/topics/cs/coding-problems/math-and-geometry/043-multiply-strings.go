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

func multiply(num1 string, num2 string) string {
	// TODO: implement
	return ""
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
