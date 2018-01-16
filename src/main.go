package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/daves125125/react-ssr-sample-golang/src/postcode"
	"github.com/daves125125/react-ssr-sample-golang/src/render"
)

var config *Config
var engine *render.Engine

type Config struct {
	polyfillLocation string
	scriptLocation   string
	templateLocation string
	staticDir        string
	port             string
}

// TODO Can abstract this and have injection via env vars or CLI through Cobra etc
func init() {
	c := new(Config)
	pwd, _ := os.Getwd()
	c.polyfillLocation = pwd + "/react-build/duktape-polyfill.js"
	c.scriptLocation = pwd + "/react-build/static/js/server.js"
	c.templateLocation = pwd + "/react-build/index.html"
	c.staticDir = pwd + "/react-build"
	c.port = "8080"

	// TODO Does dereferencing happen automatically during assignment?
	config = c

	engine = render.NewEngine(c.polyfillLocation, c.scriptLocation, c.templateLocation)
}

func main() {

	log.Println("Starting SSR Sample...")

	// These routes are extra specific as they clash with the dynamic "/static" route.
	// Could instead use regex with gorilla mux, but would complicate the sample with marginal benefit.
	fs := http.FileServer(http.Dir(config.staticDir))
	http.Handle("/static/js/", fs)
	http.Handle("/static/css/", fs)
	http.Handle("/images/", fs)

	http.HandleFunc("/postcode/", postcode.HandlePostcodeQuery)
	http.HandleFunc("/", handleDynamicRoute)

	log.Println("Listening on port:", config.port)
	http.ListenAndServe(":"+config.port, nil)
}

func handleDynamicRoute(w http.ResponseWriter, r *http.Request) {
	renderedTemplate := engine.Render(r.URL.Path, resolveServerSideState())
	w.Write([]byte(renderedTemplate))
}

type serverSideState struct {
	PostcodeQuery string              `json:"postcodeQuery"`
	Postcodes     []postcode.Postcode `json:"postcodes"`
}

func resolveServerSideState() string {

	initialPostcode := "ST3"

	serverSideState := serverSideState{}
	serverSideState.PostcodeQuery = initialPostcode
	serverSideState.Postcodes = postcode.FetchPostcodes(initialPostcode)

	serverSideStateJSON, err := json.Marshal(serverSideState)
	if err != nil {
		// TODO Handle this properly
		fmt.Println(err)
	}

	return string(serverSideStateJSON)
}
