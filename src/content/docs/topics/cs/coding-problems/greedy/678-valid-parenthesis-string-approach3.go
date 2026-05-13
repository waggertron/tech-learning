package main

import "fmt"

func checkValidString(s string) bool {
	lo := 0
	hi := 0
	for _, ch := range s {
		if ch == '(' {
			lo++
			hi++
		} else if ch == ')' {
			lo--
			hi--
		} else {
			lo--
			hi++
		}
		if hi < 0 {
			return false
		}
		if lo < 0 {
			lo = 0
		}
	}
	return lo == 0
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(checkValidString("()") == true)
	assert(checkValidString("(*)") == true)
	assert(checkValidString("(*))") == true)
	assert(checkValidString("((") == false)
	assert(checkValidString("*") == true)
	assert(checkValidString("(*") == true)
	assert(checkValidString(")") == false)
	fmt.Println("all tests pass")
}
