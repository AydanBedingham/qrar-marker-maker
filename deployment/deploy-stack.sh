#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
TEMP_DIR=$(mktemp -d -t ci-XXXXXXXXXX)

# check for missing parameters
if [ $# -ne 5 ]
then
    echo "Invalid parameters"
    echo "Usage: $0 <Region> <Action> <ArtifactBucketName> <ArtifactBucketPrefix> <StackName>"
    echo "Example: $0 us-east-1 c temp-bucket123456 release/1.03 qrar"
    exit 1
fi

# get region
Region=$1

# get act
Act=$2
case $Act in
  c) Action=create-stack;;
  u) Action=update-stack;;
  *) echo "unknown action $Act valid actions are c, or u" exit 1 ;;
esac

# get artifact bucket name
ArtifactBucketName=$3

# get artifact bucket prefix
ArtifactBucketPrefix=$4

# get stack name
StackName=$5

# deploy to CloudFormation
PackagedTemplateS3Object=$ArtifactBucketPrefix/packaged-template.yaml
FrontendArtifactBucketObject="$ArtifactBucketPrefix/webapp.zip"

aws cloudformation $Action \
    --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM \
    --parameters ParameterKey=FrontendArtifactBucketName,ParameterValue=$ArtifactBucketName ParameterKey=FrontendArtifactBucketObject,ParameterValue=$FrontendArtifactBucketObject \
    --stack-name $StackName \
    --region $Region \
    --template-url https://s3.amazonaws.com/$ArtifactBucketName/$PackagedTemplateS3Object


echo "Waiting for operation to complete..." && \

sleep 5

if [ "$Action" == "create-stack" ]; then
  # wait for create operation to complete
  aws cloudformation wait stack-create-complete \
    --region $Region \
    --stack-name $StackName || true
fi

if [ "$Action" == "update-stack" ]; then
  # wait for update operation to complete
  aws cloudformation wait stack-update-complete \
    --region $Region \
    --stack-name $StackName || true
fi

# print cloud formation outputs
aws cloudformation describe-stacks \
  --region $Region \
  --stack-name $StackName \
  --query 'Stacks[].Outputs' \
  --output text
