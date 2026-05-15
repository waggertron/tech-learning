package main

import "fmt"

type Mediator interface {
	Register(user *User)
	Send(sender *User, message string)
}

type ChatRoom struct {
	participants []*User
}

func (r *ChatRoom) Register(user *User) {
	r.participants = append(r.participants, user)
	user.mediator = r
}

func (r *ChatRoom) Send(sender *User, message string) {
	for _, p := range r.participants {
		if p != sender {
			p.Receive(sender.Name, message)
		}
	}
}

type User struct {
	Name     string
	mediator Mediator
}

func (u *User) Send(message string) {
	fmt.Printf("%s sends: %q\n", u.Name, message)
	if u.mediator != nil {
		u.mediator.Send(u, message)
	}
}

func (u *User) Receive(from, message string) {
	fmt.Printf("%s receives from %s: %q\n", u.Name, from, message)
}

func main() {
	room := &ChatRoom{}
	alice := &User{Name: "Alice"}
	bob := &User{Name: "Bob"}
	carol := &User{Name: "Carol"}

	room.Register(alice)
	room.Register(bob)
	room.Register(carol)

	alice.Send("Hello, everyone!")
	// Alice sends: "Hello, everyone!"
	// Bob receives from Alice: "Hello, everyone!"
	// Carol receives from Alice: "Hello, everyone!"
}
