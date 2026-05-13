package main

import "fmt"

func checkValidString(s string) bool {
	var f func(i, opens int) bool
	memo := map[[2]int]bool{}
	visited := map[[2]int]bool{}
	f = func(i, opens int) bool {
		if opens < 0 {
			return false
		}
		if i == len(s) {
			return opens == 0
		}
		key := [2]int{i, opens}
		if visited[key] {
			return memo[key]
		}
		var result bool
		if s[i] == '(' {
			result = f(i+1, opens+1)
		} else if s[i] == ')' {
			result = f(i+1, opens-1)
		} else {
			result = f(i+1, opens+1) || f(i+1, opens) || f(i+1, opens-1)
		}
		memo[key] = result
		visited[key] = true
		return result
	}
	return f(0, 0)
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
