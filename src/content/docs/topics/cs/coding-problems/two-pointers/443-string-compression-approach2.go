package main

import (
	"fmt"
	"strconv"
)

func compress(chars []byte) int {
	write := 0
	i := 0
	for i < len(chars) {
		char := chars[i]
		count := 0
		for i < len(chars) && chars[i] == char {
			count++
			i++
		}
		chars[write] = char
		write++
		if count > 1 {
			for _, digit := range strconv.Itoa(count) {
				chars[write] = byte(digit)
				write++
			}
		}
	}
	return write
}

func main() {
	chars1 := []byte{'a', 'a', 'b', 'b', 'c', 'c', 'c'}
	n1 := compress(chars1)
	fmt.Println(n1, string(chars1[:n1])) // 6 a2b2c3
}
