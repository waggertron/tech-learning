package main

import "fmt"

type Notification interface {
	Send(message string)
}

type EmailNotification struct{ Address string }
func (n *EmailNotification) Send(msg string) { fmt.Printf("Email to %s: %s\n", n.Address, msg) }

type SMSNotification struct{ Phone string }
func (n *SMSNotification) Send(msg string) { fmt.Printf("SMS to %s: %s\n", n.Phone, msg) }

type PushNotification struct{ DeviceID string }
func (n *PushNotification) Send(msg string) { fmt.Printf("Push to %s: %s\n", n.DeviceID, msg) }

// Simple factory function
func CreateNotification(notifType, destination string) Notification {
	switch notifType {
	case "email":
		return &EmailNotification{Address: destination}
	case "sms":
		return &SMSNotification{Phone: destination}
	case "push":
		return &PushNotification{DeviceID: destination}
	default:
		panic("unknown notification type: " + notifType)
	}
}

// Factory Method: interface with a factory method
type NotificationFactory interface {
	Create(destination string) Notification
}

type NotificationService struct {
	factory NotificationFactory
}

func (s *NotificationService) Notify(destination, message string) {
	n := s.factory.Create(destination)
	n.Send(message)
}

type EmailFactory struct{}
func (f *EmailFactory) Create(dest string) Notification { return &EmailNotification{Address: dest} }

func main() {
	n := CreateNotification("email", "user@example.com")
	n.Send("Your order shipped")
	// Email to user@example.com: Your order shipped

	svc := &NotificationService{factory: &EmailFactory{}}
	svc.Notify("admin@example.com", "Server alert")
	// Email to admin@example.com: Server alert
}
