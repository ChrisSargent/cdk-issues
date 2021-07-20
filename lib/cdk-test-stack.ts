import * as cdk from "@aws-cdk/core";
import * as api from "@aws-cdk/aws-apigateway";

export class CdkTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new api.RestApi(this, "test-api", {
      endpointExportName: "EndpointTestName",
    });

    restApi.root.addMethod("ANY");
  }
}
