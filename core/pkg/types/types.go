package types

type FireblocksEnv string

const (
	FireblocksEnvDev  FireblocksEnv = "Dev"
	FireblocksEnvProd FireblocksEnv = "Prod"
)

type LoggerMode string

const (
	LoggerModeDev  LoggerMode = "Dev"
	LoggerModeProd LoggerMode = "Prod"
)

type SSMEnv string

const (
	SSMEnvDev  SSMEnv = "Dev"
	SSMEnvProd SSMEnv = "Prod"
)

type AppConfigFireblocks struct {
	Env  FireblocksEnv `json:"env" ion:"env,omitempty"`
	Mock bool          `json:"mock" ion:"mock,omitempty"`
}

type AppConfigLedger struct {
	Name   string  `json:"name" ion:"name,omitempty"`
	Region *string `json:"region" ion:"region,omitempty"`
}

type AppConfigLogger struct {
	Mode       LoggerMode `json:"mode" ion:"mode,omitempty"`
	StackTrace bool       `json:"stackTrace" ion:"stackTrace,omitempty"`
}

type AppConfigMockServer struct {
	URL string `json:"url" ion:"url,omitempty"`
}

type AppConfigSsm struct {
	Env     SSMEnv  `json:"env" ion:"env,omitempty"`
	RoleArn string  `json:"roleArn" ion:"roleArn,omitempty"`
	Region  *string `json:"region" ion:"region,omitempty"`
}

type AppConfigProfileCore struct {
	DefaultRegion string               `json:"defaultRegion" ion:"defaultRegion,omitempty"`
	Fireblocks    *AppConfigFireblocks `json:"fireblocks" ion:"fireblocks,omitempty"`
	Ledger        *AppConfigLedger     `json:"ledger" ion:"ledger,omitempty"`
	Logger        *AppConfigLogger     `json:"logger" ion:"logger,omitempty"`
	MockServer    *AppConfigMockServer `json:"mockServer" ion:"mockServer,omitempty"`
	Ssm           *AppConfigSsm        `json:"ssm" ion:"ssm,omitempty"`
}
