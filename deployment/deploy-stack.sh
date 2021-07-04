#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
TEMP_DIR=$(mktemp -d -t ci-XXXXXXXXXX)

# show help
[ $# -le 5 ] && echo "Usage: $0 region action tempBucket stackName webappVersion artifactBucketName" && exit 1

# get act from argument 1
Region=$1

# get act from argument 2
Act=$2
case $Act in
  c) Action=create-stack;;
  u) Action=update-stack;;
  *) echo "unknown action $Act valid actions are c, or u" exit 1 ;;
esac

# get temp bucket from argument 3
TempBucket=$3

# get temp bucket from argument 4
StackName=$4

# get temp bucket from argument 5
WebappVersion=$5

# get temp bucket from argument 6
ArtifactBucketName=$6

# lint sam template
cfn-lint template.yaml

# build frontend artifacts
$SCRIPT_DIR/build-frontend-artifacts.sh "$TEMP_DIR/webapp.zip"

# upload build artifacts to bucket
aws s3 cp "$TEMP_DIR/webapp.zip" "s3://$ArtifactBucketName/webapp/webapp_$WebappVersion.zip"

# create build directory of .aws-sam
sam build

# create zip from .aws-sam and upload zip to S3
sam package \
    --s3-bucket $TempBucket \
    --s3-prefix $StackName \
    --output-template-file .aws-sam/sam-template.tmp \
    --force-upload \
    --region $Region

# deploy to CloudFormation
aws cloudformation $Action \
    --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM \
    --parameters ParameterKey=ArtifactBucketName,ParameterValue=$ArtifactBucketName ParameterKey=WebappVersion,ParameterValue=$WebappVersion \
    --stack-name $StackName \
    --region $Region \
    --template-body file://.aws-sam/sam-template.tmp

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
