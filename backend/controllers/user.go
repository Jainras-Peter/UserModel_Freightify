package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/Jainras-Peter/usermodel/db"
	"github.com/Jainras-Peter/usermodel/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// get all users
func GetUsers(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	users := []models.User{}

	cur, err := db.GetCollection("usermodal", "users").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	cur.All(ctx, &users)
	c.JSON(http.StatusOK, users)
}

// get single user
func GetUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	id := c.Param("id")
	oid, _ := primitive.ObjectIDFromHex(id)
	user := models.User{}

	err := db.GetCollection("usermodel", "users").FindOne(ctx, bson.M{"_id": oid}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// create new user
func CreateUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	c.BindJSON(&user)
	user.ID = primitive.NewObjectID()

	user.CreatedAt = time.Now().UTC().Format(time.RFC3339)

	_, err := db.GetCollection("usermodal", "users").InsertOne(ctx, user)
	if err != nil {
		fmt.Println("Insert error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, "User created successfully!")
}

// Update
func UpdateUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	id := c.Param("id")
	oid, _ := primitive.ObjectIDFromHex(id)
	var user models.User
	c.BindJSON(&user)

	update := bson.M{
		"first_name":         user.FirstName,
		"last_name":          user.LastName,
		"email":              user.Email,
		"phone":              user.Phone,
		"type":               user.Type,
		"role":               user.Role,
		"password":           user.Password,
		"user_currency":      user.UserCurrency,
		"measurement_system": user.MeasurementSystem,
		"user_status":        user.UserStatus,
	}

	_, err := db.GetCollection("usermodal", "users").UpdateOne(ctx, bson.M{"_id": oid}, bson.M{"$set": update})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	user.ID = oid
	c.JSON(http.StatusOK, "User updated successfully!")
}

// search by Filter search (name,role,type,status)

func GetUsersByFilterSearch(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	roles := c.QueryArray("roles")
	names := c.QueryArray("names")
	Type := c.Query("type")
	status := c.Query("status")

	filter := bson.M{}

	if len(roles) > 0 {
		filter["role"] = bson.M{"$in": roles}
	} else if len(names) > 0 {
		filter["first_name"] = bson.M{"$in": names}
	} else if Type != "" {
		filter["type"] = Type
	} else if status != "" {
		isActive := status == "true"
		filter["user_status"] = isActive

	}

	users := []models.User{}

	cur, err := db.GetCollection("usermodal", "users").Find(ctx, filter)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cur.Close(ctx)

	if err := cur.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

// Delete
func DeleteUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	id := c.Param("id")
	oid, _ := primitive.ObjectIDFromHex(id)

	_, err := db.GetCollection("usermodal", "users").DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}
