# react-ssr-sample-golang

[![CircleCI](https://circleci.com/gh/daves125125/react-ssr-sample-golang.svg?style=svg&circle-token=5429e86f218c76bc2fe839e08b94cd42fcde5e0a)](https://circleci.com/gh/daves125125/react-ssr-sample-golang)

This project demonstrates rendering a react app on the server side using Golang. 


## TL;DR

The client side code consists of a small React app that uses some popular libraries such as react-router, bootstrap etc. It 
features a page that has dynamic data with state inserted from the server side which can then also be later updated on the client side. 

The server side code consists of a simple Go application that renders JS with the help of [Duktape](http://duktape.org/index.html) and [Go Duktape bindings](https://github.com/olebedev/go-duktape). The server side app fetches some basic postcode data available from a third party, open API - https://api.postcodes.io.


## Run

This sample has been packaged as a docker container and can be ran by executing: 

```
docker run -p8080:8080 daves125125/react-ssr-sample-golang
```

Navigate to `localhost:8080/` to see the sample running.


## Build / Run from source
```
yarn install && yarn build && go run src/main.go
```

Or, via Docker:

```
yarn install && yarn build 
docker build -t test .
docker run -p8080:8080 test
```


## How this works / Areas of interest

The JS code is split into two main bundles, the client.js and server.js. These are built as independent source sets 
by Webpack. Both the server.js and client.js depend upon the the main React App itself with the only difference being 
that the client side component includes client side specific code such as browser routing, and the server side code includes
server side routing and injection of initial state.

The Server side uses Duktape to render only the server.js bundle which gets packaged as part of the build process.

Regarding SSR, the main files of interest are:

- react-src/client.js
- react-src/server.js
- src/main.go (contains the entrypoint and routing logic)
- src/render/engine.go (contains the rendering / binding logic to Duktape)


## Performance

The below have been collected from repeated runs using the AB testing tool. This has been ran on a MacBook Pro (Retina, 13-inch, Early 2015) 

|                     | At Rest / Startup  | Under Load  |
| ------------------- |:------------------:| -----------:|
| Render Speed (ms)   | ~60                | ~60         |
| Throughput (msgs/s) | ~16                | ~16         |
| Memory Usage (Mb)   | ~9                 | ~20         |


## Known TODOs

- Refactoring needed on the Go sample code itself (few questionable areas and not so idiomatic)
- Render speed is a little slower than expected, presumably because this is fresh evaluation of the script on each invocation (i.e no caching or up front compiling of the scripts)
- Caching could be easily implemented, both on the templates and the server side state within the service.
- Properly strip down webpack config and ejected create-react-app to barebones needed
