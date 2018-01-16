package postcode

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"encoding/json"
)

const apiEndpoint = "https://api.postcodes.io"
const queryString = "/postcodes/?q="

type PostcodeResponse struct {
	Status int        `json:"status"`
	Result []Postcode `json:"result"`
}

type Postcode struct {
	Postcode  string  `json:"postcode"`
	Country   string  `json:"country"`
	Region    string  `json:"region"`
	Longitude float32 `json:"longitude"`
	Latitude  float32 `json:"latitude"`
}

func FetchPostcodes(postcode string) []Postcode {

	resp, err := http.Get(apiEndpoint + queryString + postcode)
	if err != nil {
		// TODO handle error
		fmt.Println(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	postcodeRes := PostcodeResponse{0, make([]Postcode, 0)}
	json.Unmarshal(body, &postcodeRes)

	postcodeResults := postcodeRes.Result
	if postcodeResults == nil {
		postcodeResults = make([]Postcode, 0)
	}

	return postcodeResults
}
