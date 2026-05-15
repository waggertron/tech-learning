package main

import "fmt"

type FileSystemItem interface {
	GetSize() int
	GetName() string
}

type FileNode struct {
	name string
	size int
}

func (f *FileNode) GetSize() int    { return f.size }
func (f *FileNode) GetName() string { return f.name }

type DirNode struct {
	name     string
	children []FileSystemItem
}

func (d *DirNode) Add(item FileSystemItem) {
	d.children = append(d.children, item)
}

func (d *DirNode) Remove(item FileSystemItem) {
	filtered := d.children[:0]
	for _, c := range d.children {
		if c != item {
			filtered = append(filtered, c)
		}
	}
	d.children = filtered
}

func (d *DirNode) GetSize() int {
	total := 0
	for _, child := range d.children {
		total += child.GetSize()
	}
	return total
}

func (d *DirNode) GetName() string { return d.name }

func main() {
	root := &DirNode{name: "root"}
	src := &DirNode{name: "src"}
	src.Add(&FileNode{name: "main.go", size: 1200})
	src.Add(&FileNode{name: "utils.go", size: 800})

	assets := &DirNode{name: "assets"}
	assets.Add(&FileNode{name: "logo.png", size: 45000})

	root.Add(src)
	root.Add(assets)
	root.Add(&FileNode{name: "README.md", size: 300})

	fmt.Println(root.GetSize()) // 47300
	fmt.Println(src.GetSize())  // 2000
}
