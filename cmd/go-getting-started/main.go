package main

import (
	"bytes"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

var (
	repeat int
)

func ssbHandler(c *gin.Context) {
	var buffer bytes.Buffer
	apiNumber := c.Params.ByName("number")
	for i := 0; i < repeat; i++ {
		buffer.WriteString(apiNumber)
	}
	c.String(http.StatusOK, buffer.String())
}

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("templates/*.tmpl.html")
	router.Static("/static", "static")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl.html", nil)
	})

	router.GET("/ssbapi/:number", ssbHandler)

	router.Run(":" + port)
}
