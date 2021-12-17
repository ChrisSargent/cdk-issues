import * as cdk from "@aws-cdk/core";
import * as events from '@aws-cdk/aws-events';


export class CdkTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new events.EventBus(this, 'MyEventBus', {
      eventBusName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
  }
}
