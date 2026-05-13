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

type TimeMap struct {
	// TODO: implement
}

func NewTimeMap() *TimeMap {
	return &TimeMap{}
}

func (t *TimeMap) Set(key, value string, timestamp int) {
	// TODO: implement
}

func (t *TimeMap) Get(key string, timestamp int) string {
	// TODO: implement
	return ""
}

func runTests() {
	store := NewTimeMap()
	store.Set("foo", "bar", 1)
	assert(store.Get("foo", 1) == "bar")
	assert(store.Get("foo", 3) == "bar")
	store.Set("foo", "bar2", 4)
	assert(store.Get("foo", 4) == "bar2")
	assert(store.Get("foo", 5) == "bar2")
	assert(store.Get("foo", 0) == "")
	assert(store.Get("missing", 1) == "")
	fmt.Println("all tests pass")
}

func main() { runTests() }
