package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FirstName         string             `bson:"first_name" json:"firstName"`
	LastName          string             `bson:"last_name" json:"lastName"`
	Email             string             `bson:"email" json:"email"`
	Phone             string             `bson:"phone" json:"phone"`
	Type              string             `bson:"type" json:"type"`
	Role              string             `bson:"role" json:"role"`
	CreatedAt         string             `bson:"created_at" json:"createdAt"`
	Password          string             `bson:"password" json:"password"`
	UserCurrency      string             `bson:"user_currency" json:"userCurrency"`
	MeasurementSystem string             `bson:"measurement_system" json:"measurementSystem"`
	UserStatus        bool               `bson:"user_status" json:"userStatus"`
}
