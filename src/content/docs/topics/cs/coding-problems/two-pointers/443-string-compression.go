package main

import "fmt"

func compress(chars []byte) int {
	return 0
}

func main() {
	chars1 := []byte{'a', 'a', 'b', 'b', 'c', 'c', 'c'}
	n1 := compress(chars1)
	fmt.Println(n1, string(chars1[:n1])) // 6 a2b2c3

	chars2 := []byte{'a'}
	fmt.Println(compress(chars2)) // 1

	chars3 := []byte("abbbbbbbbbbbbb")
	n3 := compress(chars3)
	fmt.Println(n3, string(chars3[:n3])) // 4 ab12
}
