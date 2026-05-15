package main

import "fmt"

type TrafficLightState interface {
	Next(ctx *TrafficLight)
	GetColor() string
}

type RedState struct{}

func (r *RedState) Next(ctx *TrafficLight) { ctx.SetState(&GreenState{}) }
func (r *RedState) GetColor() string       { return "Red" }

type GreenState struct{}

func (g *GreenState) Next(ctx *TrafficLight) { ctx.SetState(&YellowState{}) }
func (g *GreenState) GetColor() string       { return "Green" }

type YellowState struct{}

func (y *YellowState) Next(ctx *TrafficLight) { ctx.SetState(&RedState{}) }
func (y *YellowState) GetColor() string       { return "Yellow" }

type TrafficLight struct{ state TrafficLightState }

func (t *TrafficLight) SetState(s TrafficLightState) { t.state = s }
func (t *TrafficLight) Next()                        { t.state.Next(t) }
func (t *TrafficLight) GetColor() string             { return t.state.GetColor() }

func main() {
	light := &TrafficLight{state: &RedState{}}
	fmt.Println(light.GetColor()) // Red
	light.Next()
	fmt.Println(light.GetColor()) // Green
	light.Next()
	fmt.Println(light.GetColor()) // Yellow
	light.Next()
	fmt.Println(light.GetColor()) // Red
}
