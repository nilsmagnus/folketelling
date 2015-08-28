package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func ssbHandler(c *gin.Context) {
	apiNumber := c.Params.ByName("number")

	var urlBuffer bytes.Buffer
	urlBuffer.WriteString("http://data.ssb.no/api/v0/dataset/")
	urlBuffer.WriteString(apiNumber)
	urlBuffer.WriteString(".json")

	ssbResponse, err := http.Get(urlBuffer.String())
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
	}
	defer ssbResponse.Body.Close()
	if ssbResponse.StatusCode != http.StatusOK {
		c.String(ssbResponse.StatusCode, string(ssbResponse.Status))
	} else {
		contents, err := ioutil.ReadAll(ssbResponse.Body)
		if err != nil {
			c.Header("Content-Type", "application/json")
			c.String(http.StatusInternalServerError, err.Error())
		}
		c.String(http.StatusOK, string(contents))
	}
}

var ()

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Static("/js", "js")
	router.Static("/static", "static")

	router.LoadHTMLGlob("templates/*.tmpl.html")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl.html", nil)
	})

	router.GET("/ssbapi/:number", ssbHandler)

	router.Run(":" + port)
}
