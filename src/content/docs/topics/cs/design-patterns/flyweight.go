package main

import (
	"fmt"
	"sync"
)

type TreeType struct {
	Name    string
	Color   string
	Texture string
}

func (t *TreeType) Draw(x, y int) {
	fmt.Printf(
		"Drawing %s (%s) at (%d, %d) [texture: %s]\n",
		t.Name, t.Color, x, y, t.Texture,
	)
}

type treeTypeFactory struct {
	mu    sync.Mutex
	types map[string]*TreeType
}

var factory = &treeTypeFactory{types: make(map[string]*TreeType)}

func (f *treeTypeFactory) Get(name, color, texture string) *TreeType {
	key := name + "|" + color + "|" + texture
	f.mu.Lock()
	defer f.mu.Unlock()
	if t, ok := f.types[key]; ok {
		return t
	}
	t := &TreeType{Name: name, Color: color, Texture: texture}
	f.types[key] = t
	return t
}

func (f *treeTypeFactory) Count() int {
	f.mu.Lock()
	defer f.mu.Unlock()
	return len(f.types)
}

type Tree struct {
	x, y     int
	treeType *TreeType
}

func (t *Tree) Draw() { t.treeType.Draw(t.x, t.y) }

type Forest struct {
	trees []*Tree
}

func (f *Forest) PlantTree(x, y int, name, color, texture string) {
	t := factory.Get(name, color, texture)
	f.trees = append(f.trees, &Tree{x: x, y: y, treeType: t})
}

func (f *Forest) Draw() {
	for _, t := range f.trees {
		t.Draw()
	}
}

func main() {
	forest := &Forest{}
	forest.PlantTree(10, 20, "Oak", "dark green", "rough")
	forest.PlantTree(30, 40, "Oak", "dark green", "rough")   // reuses
	forest.PlantTree(50, 60, "Pine", "light green", "smooth")
	forest.PlantTree(70, 80, "Oak", "dark green", "rough")   // reuses

	forest.Draw()
	fmt.Printf("TreeType instances: %d\n", factory.Count()) // 2, not 4
}
