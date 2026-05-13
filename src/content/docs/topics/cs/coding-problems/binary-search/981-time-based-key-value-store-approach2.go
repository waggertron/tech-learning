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

type entry struct {
	timestamp int
	value     string
}

type TimeMap struct {
	data map[string][]entry
}

func NewTimeMap() *TimeMap {
	return &TimeMap{data: make(map[string][]entry)}
}

func (t *TimeMap) Set(key, value string, timestamp int) {
	t.data[key] = append(t.data[key], entry{timestamp, value})
}

func (t *TimeMap) Get(key string, timestamp int) string {
	entries := t.data[key]
	lo, hi := 0, len(entries)-1
	result := ""
	for lo <= hi {
		mid := (lo + hi) / 2
		if entries[mid].timestamp <= timestamp {
			result = entries[mid].value
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return result
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
