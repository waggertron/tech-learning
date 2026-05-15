package main

import "fmt"

// Product interfaces
type Button interface {
	Render()
	OnClick()
}

type Checkbox interface {
	Render()
	Toggle()
}

// Abstract factory interface
type UIFactory interface {
	CreateButton() Button
	CreateCheckbox() Checkbox
}

// Light theme products
type LightButton struct{}

func (b *LightButton) Render() {
	fmt.Println("Rendering light button: white background, dark border")
}

func (b *LightButton) OnClick() {
	fmt.Println("Light button clicked")
}

type LightCheckbox struct {
	checked bool
}

func (c *LightCheckbox) Render() {
	state := "unchecked"
	if c.checked {
		state = "checked"
	}
	fmt.Printf("Rendering light checkbox: %s\n", state)
}

func (c *LightCheckbox) Toggle() {
	c.checked = !c.checked
	fmt.Printf("Light checkbox toggled to %v\n", c.checked)
}

// Dark theme products
type DarkButton struct{}

func (b *DarkButton) Render() {
	fmt.Println("Rendering dark button: dark background, light border")
}

func (b *DarkButton) OnClick() {
	fmt.Println("Dark button clicked")
}

type DarkCheckbox struct {
	checked bool
}

func (c *DarkCheckbox) Render() {
	state := "unchecked"
	if c.checked {
		state = "checked"
	}
	fmt.Printf("Rendering dark checkbox: %s\n", state)
}

func (c *DarkCheckbox) Toggle() {
	c.checked = !c.checked
	fmt.Printf("Dark checkbox toggled to %v\n", c.checked)
}

// Concrete factories
type LightFactory struct{}

func (f *LightFactory) CreateButton() Button {
	return &LightButton{}
}

func (f *LightFactory) CreateCheckbox() Checkbox {
	return &LightCheckbox{}
}

type DarkFactory struct{}

func (f *DarkFactory) CreateButton() Button {
	return &DarkButton{}
}

func (f *DarkFactory) CreateCheckbox() Checkbox {
	return &DarkCheckbox{}
}

// Client -- knows nothing about concrete classes
func renderSettingsPanel(factory UIFactory) {
	button := factory.CreateButton()
	checkbox := factory.CreateCheckbox()

	button.Render()
	checkbox.Render()
	checkbox.Toggle()
	button.OnClick()
}

func main() {
	var factory UIFactory = &LightFactory{}
	renderSettingsPanel(factory)

	fmt.Println("---")

	factory = &DarkFactory{}
	renderSettingsPanel(factory)
}
