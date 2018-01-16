# Build stage
FROM golang:1.9-stretch AS build-env
RUN curl -fsSL -o /usr/local/bin/dep https://github.com/golang/dep/releases/download/v0.3.2/dep-linux-amd64 && chmod +x /usr/local/bin/dep
RUN mkdir -p /go/src/github.com/daves125125/react-ssr-sample-golang
WORKDIR /go/src/github.com/daves125125/react-ssr-sample-golang
COPY . ./
RUN dep ensure
RUN cd src && env CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o goapp

# Package stage
FROM debian:9-slim
RUN apt-get update && apt-get install -y ca-certificates
COPY --from=build-env /go/src/github.com/daves125125/react-ssr-sample-golang/src/goapp /app/goapp
COPY ./react-build/ /app/react-build/
WORKDIR /app
EXPOSE 8080
ENTRYPOINT [ "/app/goapp" ]
