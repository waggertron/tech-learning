package main

import "fmt"

type Image interface {
	Display()
}

// Compile-time interface check.
var _ Image = (*ImageProxy)(nil)

type RealImage struct {
	filename string
	data     string
}

func NewRealImage(filename string) *RealImage {
	img := &RealImage{filename: filename}
	img.data = img.loadFromDisk()
	return img
}

func (r *RealImage) loadFromDisk() string {
	fmt.Printf("Loading %s from disk...\n", r.filename)
	return fmt.Sprintf("<image data for %s>", r.filename)
}

func (r *RealImage) Display() {
	fmt.Printf("Displaying %s: %s\n", r.filename, r.data)
}

type ImageProxy struct {
	filename  string
	realImage *RealImage
}

func NewImageProxy(filename string) *ImageProxy {
	return &ImageProxy{filename: filename}
}

func (p *ImageProxy) Display() {
	if p.realImage == nil {
		p.realImage = NewRealImage(p.filename)
	}
	p.realImage.Display()
}

func main() {
	var image Image = NewImageProxy("photo.jpg")
	fmt.Println("Proxy created, no disk access yet")

	image.Display() // loads now
	image.Display() // uses cached
}
