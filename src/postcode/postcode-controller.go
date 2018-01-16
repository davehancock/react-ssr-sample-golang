package postcode

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

// HandlePostcodeQuery returns JSON representing a series of postcodes for a given request
func HandlePostcodeQuery(w http.ResponseWriter, r *http.Request) {

	extractedPostcode := extractPostcodeFromPath(r.URL.Path)
	postcodes := FetchPostcodes(extractedPostcode)

	postcodeJSON, err := json.Marshal(postcodes)
	if err != nil {
		// TODO Handle this properly
		fmt.Println(err)
	}

	w.Write([]byte(postcodeJSON))
}

func extractPostcodeFromPath(path string) string {
	return strings.SplitAfter(path, "/postcode/")[1]
}
