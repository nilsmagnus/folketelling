package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func ssbHandler(c *gin.Context) {
	apiNumber := c.Params.ByName("number")

	apiURL := fmt.Sprint("http://data.ssb.no/api/v0/dataset/", apiNumber, ".json")

	ssbResponse, err := http.Get(apiURL)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
	}
	defer ssbResponse.Body.Close()
	if ssbResponse.StatusCode != http.StatusOK {
		c.String(ssbResponse.StatusCode, string(ssbResponse.Status))
	} else {
		contents, err := ioutil.ReadAll(ssbResponse.Body)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
		} else{
			c.Writer.Header().Set("Content-Type", "application/json")
			c.String(http.StatusOK, string(contents))
		}
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

	router.LoadHTMLGlob("templates/*.html")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.GET("/pages/:page", func(c *gin.Context) {
		page := fmt.Sprint(c.Params.ByName("page"), ".html")
		c.HTML(http.StatusOK, page, nil)
	})

	router.GET("/ssbapi/:number", ssbHandler)

	router.Run(":" + port)
}
