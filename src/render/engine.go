package render

import (
	"fmt"
	"io/ioutil"

	"gopkg.in/olebedev/go-duktape.v3"
)

type Engine struct {
	polyfillContents string
	scriptContents   string
	templateContents string
}

func NewEngine(polyfillLocation, scriptLocation, templateLocation string) *Engine {

	e := new(Engine)
	e.polyfillContents = loadFileContents(polyfillLocation)
	e.scriptContents = loadFileContents(scriptLocation)
	e.templateContents = loadFileContents(templateLocation)
	return e
}

func loadFileContents(filePath string) string {

	scriptContents, err := ioutil.ReadFile(filePath)
	if err != nil {
		// TODO Handle this properly
		fmt.Println(err)
		panic(err)
	}
	return string(scriptContents)
}

// We create and teardown a new duktape context per invocation, bit wasteful but likely not thread safe otherwise
func (e *Engine) Render(currentPath string, serverSideState string) string {

	ctx := duktape.New()

	if err := ctx.PevalString(e.polyfillContents); err != nil {
		fmt.Println("Error evaluating polyfill:", err, "Line number:", err.(*duktape.Error).LineNumber)
		panic(err.(*duktape.Error).Message)
	}

	if err := ctx.PevalString(e.scriptContents); err != nil {
		fmt.Println("Error evaluating script:", err, "Line number:", err.(*duktape.Error).LineNumber)
		panic(err.(*duktape.Error).Message)
	}

	// TODO All of the below could panic
	ctx.GetGlobalString("render")
	ctx.PushString(e.templateContents)
	ctx.PushString(currentPath)
	ctx.PushString(serverSideState)
	ctx.Call(3)

	result := ctx.GetString(-1)

	ctx.DestroyHeap()

	return result
}
