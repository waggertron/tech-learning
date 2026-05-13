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
	timestamps map[string][]int
	values     map[string][]string
}

func NewTimeMap() *TimeMap {
	return &TimeMap{
		timestamps: make(map[string][]int),
		values:     make(map[string][]string),
	}
}

func (t *TimeMap) Set(key, value string, timestamp int) {
	t.timestamps[key] = append(t.timestamps[key], timestamp)
	t.values[key] = append(t.values[key], value)
}

func (t *TimeMap) Get(key string, timestamp int) string {
	ts := t.timestamps[key]
	// bisect_right equivalent
	lo, hi := 0, len(ts)
	for lo < hi {
		mid := (lo + hi) / 2
		if ts[mid] <= timestamp {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	i := lo - 1
	if i < 0 {
		return ""
	}
	return t.values[key][i]
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
