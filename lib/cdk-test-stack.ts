import * as cdk from "@aws-cdk/core";
import * as pipelines from "@aws-cdk/pipelines";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";

export class CdkTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cdkInput = pipelines.CodePipelineSource.gitHub(
      "ChrisSargent/cdk-issues",
      "pipelines"
    );

    // Setup the code source action
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      owner: "ChrisSargent",
      repo: "cdk-issues",
      branch: "pipelines",
      actionName: "SourceAction",
      output: sourceOutput,
      oauthToken: cdk.SecretValue.secretsManager("git/ChrisSargent"),
    });

    // Setup the linting action
    const lintProject = new codebuild.PipelineProject(this, "LintProject", {
      buildSpec: codebuild.BuildSpec.fromObject({
        phases: {
          pre_build: {
            commands: ['echo "lint all the things'],
          },
        },
        version: "0.2",
      }),
    });
    const lintAction = new codepipeline_actions.CodeBuildAction({
      actionName: "LintAction",
      input: sourceOutput,
      project: lintProject,
      type: codepipeline_actions.CodeBuildActionType.TEST,
    });

    const pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      restartExecutionOnUpdate: true,
      stages: [
        {
          actions: [sourceAction],
          stageName: "GitSource",
        },
        {
          actions: [lintAction],
          stageName: "Lint",
        },
      ],
    });

    cdkInput.produceAction(
      {
        pipeline,
        stageName: "Input",
      },
      { scope: this }
    );

    const cdkPipeline = new pipelines.CodePipeline(this, "CDKPipeline", {
      codePipeline: pipeline,
      synth: new pipelines.ShellStep("Synth", {
        // Without input, we get: Error: CodeBuild action 'Synth' requires an input (and the pipeline doesn't have a Source to fall back to). Add an input or a pipeline source.
        // With input, we get:Error: Validation failed with the following errors: Source actions may only occur in first stage
        input: cdkInput,
        commands: ["yarn install --frozen-lockfile", "npx cdk synth"],
      }),
    });

    // Produces: Stage 'PreProd' must have at least one action
    // pipeline.addStage(new MyApplication(this, "PreProd"));

    // Produces: The given Stage construct ('CdkTestStack/PreProd') should contain at least one Stack
    cdkPipeline.addStage(new MyApplication(this, "PreProd"));
  }
}

class MyApplication extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    console.log("CDK Stage");
    new MyStack(this, "MyStack");
  }
}

class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log("CDK Stack");
  }
}
