package main

import "fmt"

type DataService interface {
	FetchData(key string) string
}

// Compile-time interface checks.
var _ DataService = (*LoggerDecorator)(nil)
var _ DataService = (*CacheDecorator)(nil)

type RealDataService struct{}

func (r *RealDataService) FetchData(key string) string {
	fmt.Printf("  [DB] Fetching key: %s\n", key)
	return "value_for_" + key
}

type LoggerDecorator struct {
	wrapped DataService
}

func (l *LoggerDecorator) FetchData(key string) string {
	fmt.Printf("[LOG] FetchData called with key=%q\n", key)
	result := l.wrapped.FetchData(key)
	fmt.Printf("[LOG] FetchData returned %q\n", result)
	return result
}

type CacheDecorator struct {
	wrapped DataService
	cache   map[string]string
}

func NewCacheDecorator(wrapped DataService) *CacheDecorator {
	return &CacheDecorator{wrapped: wrapped, cache: make(map[string]string)}
}

func (c *CacheDecorator) FetchData(key string) string {
	if val, ok := c.cache[key]; ok {
		fmt.Printf("[CACHE] hit for %q\n", key)
		return val
	}
	result := c.wrapped.FetchData(key)
	c.cache[key] = result
	fmt.Printf("[CACHE] stored %q\n", key)
	return result
}

func main() {
	var service DataService = NewCacheDecorator(
		&LoggerDecorator{wrapped: &RealDataService{}},
	)

	fmt.Println("--- First call ---")
	service.FetchData("user:42")

	fmt.Println("--- Second call ---")
	service.FetchData("user:42")
}
