package main

import (
	"fmt"
	"reflect"
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

func setZeroes(matrix [][]int) {
	// TODO: implement
}

func runTests() {
	m := [][]int{{1, 1, 1}, {1, 0, 1}, {1, 1, 1}}
	setZeroes(m)
	assert(reflect.DeepEqual(m, [][]int{{1, 0, 1}, {0, 0, 0}, {1, 0, 1}}))
	m2 := [][]int{{0, 1, 2, 0}, {3, 4, 5, 2}, {1, 3, 1, 5}}
	setZeroes(m2)
	assert(reflect.DeepEqual(m2, [][]int{{0, 0, 0, 0}, {0, 4, 5, 0}, {0, 3, 1, 0}}))
	m3 := [][]int{{1}}
	setZeroes(m3)
	assert(reflect.DeepEqual(m3, [][]int{{1}}))
	m4 := [][]int{{0}}
	setZeroes(m4)
	assert(reflect.DeepEqual(m4, [][]int{{0}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
