package main

import "fmt"

func assert(condition bool, message string) {
	if !condition {
		panic(message)
	}
}

type entry struct {
	timestamp int
	value     string
}

type TimeMap struct {
	values map[string][]entry
}

func NewTimeMap() *TimeMap {
	return &TimeMap{values: make(map[string][]entry)}
}

func (timeMap *TimeMap) Set(key string, value string, timestamp int) {
	timeMap.values[key] = append(timeMap.values[key], entry{timestamp: timestamp, value: value})
}

func (timeMap *TimeMap) Get(key string, timestamp int) string {
	entries := timeMap.values[key]
	left, right := 0, len(entries)-1
	result := ""
	for left <= right {
		middle := left + (right-left)/2
		if entries[middle].timestamp <= timestamp {
			result = entries[middle].value
			left = middle + 1
		} else {
			right = middle - 1
		}
	}
	return result
}

func runTests() {
	// TEST_VECTORS_BEGIN sha256:cf4d23abaa64548a94333272dc1be063e51de9f2106a9e536fc46e3860921b71
	subject1 := NewTimeMap()
	subject1.Set("foo", "bar", 1)
	assert(subject1.Get("foo", 1) == "bar", "exact-and-prior-lookups[2]")
	assert(subject1.Get("foo", 3) == "bar", "exact-and-prior-lookups[3]")
	subject1.Set("foo", "bar2", 4)
	assert(subject1.Get("foo", 4) == "bar2", "exact-and-prior-lookups[5]")
	assert(subject1.Get("foo", 5) == "bar2", "exact-and-prior-lookups[6]")
	subject2 := NewTimeMap()
	subject2.Set("alpha", "one", 1)
	subject2.Set("beta", "two", 2)
	assert(subject2.Get("alpha", 2) == "one", "keys-remain-independent[3]")
	assert(subject2.Get("beta", 2) == "two", "keys-remain-independent[4]")
	subject3 := NewTimeMap()
	assert(subject3.Get("missing", 1) == "", "missing-key[1]")
	subject4 := NewTimeMap()
	subject4.Set("foo", "bar", 2)
	assert(subject4.Get("foo", 1) == "", "lookup-before-first-timestamp[2]")
	// EXCLUDED_VECTOR nonincreasing-timestamp: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["foo","bar",2]},{"operation":"set","arguments":["foo","older",1]}]] | Set timestamps must increase for each key.
	// EXCLUDED_VECTOR empty-key: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["","bar",1]}]] | Keys must contain at least one lowercase letter.
	// EXCLUDED_VECTOR zero-timestamp: [[{"operation":"init","arguments":[]},{"operation":"set","arguments":["foo","bar",0]}]] | Timestamps start at one in the problem contract.
	// TEST_VECTORS_END
	fmt.Println("All shared test vectors passed")
}

func main() {
	runTests()
}
