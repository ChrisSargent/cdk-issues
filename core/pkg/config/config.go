package config

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/ChrisSargent/cdk-issues/core/pkg/types"
)

func New() (*types.AppConfigProfileCore, error) {
	var (
		appConfigExtensionPath string
		present                bool
	)

	const (
		appConfigExtensionPathEV string = "AWS_APPCONFIG_EXTENSION_PREFETCH_LIST"
		errmessage               string = "environment variable not found"
	)

	if appConfigExtensionPath, present = os.LookupEnv(appConfigExtensionPathEV); !present {
		err := errors.New(errmessage)
		return nil, err
	}

	url := "http://localhost:2772" + appConfigExtensionPath

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	baseAppConfig := &types.AppConfigProfileCore{}

	err = json.Unmarshal(body, baseAppConfig)
	if err != nil {
		return nil, err
	}

	log.Printf("In Config: %s", body)

	return baseAppConfig, nil
}
