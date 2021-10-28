import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambdago from '@aws-cdk/aws-lambda-go';
import * as lambda from '@aws-cdk/aws-lambda';

export class CdkTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFn = new lambdago.GoFunction(this, 'handler', {
      entry: 'core/cmd/echo',
      environment: {
        AWS_APPCONFIG_EXTENSION_PREFETCH_LIST:
          '/applications/NoahConfig/environments/Dev/configurations/ConfigProfile',
      },
    });

    /**
     * Add the AppConfig extension, see: https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-lambda-extensions.html
     */
    const appCfgLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      `${id}CfgLayer`,
      'arn:aws:lambda:eu-west-2:282860088358:layer:AWS-AppConfig-Extension:42'
    );
    lambdaFn.addLayers(appCfgLayer);

    lambdaFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['appconfig:GetConfiguration'],
        effect: iam.Effect.ALLOW,
        resources: [`arn:aws:appconfig:eu-west-2:005666407698:application/e7ixw3s*`],
      })
    );
  }
}
