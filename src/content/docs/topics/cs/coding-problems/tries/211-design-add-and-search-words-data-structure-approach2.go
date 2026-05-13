package main

import "fmt"

// Approach 2: length-bucketed map + per-position char compare

type WordDictionary struct {
	byLen map[int][]string
}

func NewWordDictionary() *WordDictionary {
	return &WordDictionary{byLen: make(map[int][]string)}
}

func (wd *WordDictionary) AddWord(word string) {
	wd.byLen[len(word)] = append(wd.byLen[len(word)], word)
}

func (wd *WordDictionary) Search(word string) bool {
	candidates := wd.byLen[len(word)]
	for _, w := range candidates {
		match := true
		for i := 0; i < len(word); i++ {
			if word[i] != '.' && word[i] != w[i] {
				match = false
				break
			}
		}
		if match {
			return true
		}
	}
	return false
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func runTests() {
	wd := NewWordDictionary()
	wd.AddWord("bad")
	wd.AddWord("dad")
	wd.AddWord("mad")
	assert(wd.Search("pad") == false)
	assert(wd.Search("bad") == true)
	assert(wd.Search(".ad") == true)
	assert(wd.Search("b..") == true)
	assert(wd.Search("...") == true)
	assert(wd.Search("....") == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
