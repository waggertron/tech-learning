package main

import (
	"fmt"
	"sync"
)

type AppConfig struct {
	settings map[string]string
	mu       sync.RWMutex
}

var (
	configInstance *AppConfig
	configOnce     sync.Once
)

func GetConfig() *AppConfig {
	configOnce.Do(func() {
		configInstance = &AppConfig{
			settings: map[string]string{
				"env":  "development",
				"port": "3000",
			},
		}
	})
	return configInstance
}

func (c *AppConfig) Get(key string) (string, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	val, ok := c.settings[key]
	return val, ok
}

func (c *AppConfig) Set(key, value string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.settings[key] = value
}

func main() {
	cfg1 := GetConfig()
	cfg2 := GetConfig()
	fmt.Println(cfg1 == cfg2) // true

	cfg1.Set("feature_x", "enabled")
	val, _ := cfg2.Get("feature_x")
	fmt.Println(val) // enabled
}
