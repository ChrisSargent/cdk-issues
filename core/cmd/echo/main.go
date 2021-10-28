package main

import (
	"context"
	"log"

	"github.com/ChrisSargent/cdk-issues/core/pkg/config"
	"github.com/ChrisSargent/cdk-issues/core/pkg/types"
	"github.com/aws/aws-lambda-go/lambda"
)

var AppConfig *types.AppConfigProfileCore

func init() {
	var err error
	AppConfig, err = config.New()
	if err != nil {
		log.Print(err)
	}
}

func dummyHandler(ctx context.Context) error {
	log.Printf("In Main: %+v", AppConfig)

	return nil
}

func main() {
	lambda.Start(dummyHandler)
}
