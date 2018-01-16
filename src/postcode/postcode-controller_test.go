package postcode

import (
	"fmt"
	"testing"
)

func TestManipulateString(t *testing.T) {

	res := extractPostcodeFromPath("/postcode/ST3")
	
	if !(res == "ST3") {
		fmt.Println(res)
		t.Fail()
	}
}
