package postcode

import (
	"fmt"
	"testing"
)

func TestPostcodeService(t *testing.T) {

	res := FetchPostcodes("ST1")
	postcode1 := res[0]

	if !(postcode1.Postcode == "ST1 1AP") {
		fmt.Println(res)
		t.Fail()
	}
}
