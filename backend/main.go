package main

import (
	"net/http"

	"github.com/Jainras-Peter/usermodel/controllers"
	"github.com/Jainras-Peter/usermodel/db"
	"github.com/gin-gonic/gin"
)

func main() {
	db.Connect("mongodb://localhost:27017/usermodal")

	r := gin.Default()
	//cors
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})
	//routes
	api := r.Group("/api")
	{
		api.GET("/users", controllers.GetUsers)
		// api.GET("/users/type", controllers.GetUsersType)
		api.GET("/users/:id", controllers.GetUser)
		api.POST("/users", controllers.CreateUser)
		api.PUT("/users/:id", controllers.UpdateUser)
		api.DELETE("/users/:id", controllers.DeleteUser)
		api.GET("/users/filter", controllers.GetUsersByFilterSearch)
		// api.GET("/users/names", controllers.GetUsersByNames)

	}

	r.Run(":8080")
}
