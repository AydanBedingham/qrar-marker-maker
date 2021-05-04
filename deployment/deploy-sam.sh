#!/bin/bash
set -e

export StackName=${2:-`echo "qrar"`}
export Region=us-east-2
export S3bucket=temp-bucket12345

# show help
[ $# -eq 0 ] && echo "Usage: $0 action" && exit 1

# get act from argument 1
export act=$1
case $act in
  c) Action=create-stack;;
  d) Action=delete-stack;;
  u) Action=update-stack;;
  *) echo "unknown action $act  valid actions are c, d, or u   Usage: $0 action" exit 1 ;;
esac

if [ "$Action" == "delete-stack" ]; then
    # delete from CloudFormation
    aws cloudformation $Action \
        --stack-name $StackName

    echo "Waiting for operation to complete..."

    sleep 5

    aws cloudformation wait stack-delete-complete \
      --stack-name $StackName

    exit 0
fi

# create build directory of .aws-sam
sam build

# create zip from .aws-sam and upload zip to S3
sam package \
    --s3-bucket $S3bucket \
    --s3-prefix $StackName \
    --output-template-file sam-template.tmp \
    --force-upload \
    --region $Region

# deploy to CloudFormation
aws cloudformation $Action \
    --stack-name $StackName \
    --template-body file://sam-template.tmp \
    --parameters file://parameters.json \
    --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM \
    --region $Region

echo "Waiting for operation to complete..." && \

sleep 5

if [ "$Action" == "create-stack" ]; then
  # wait for create operation to complete
  aws cloudformation wait stack-create-complete \
    --stack-name $StackName || true
fi

if [ "$Action" == "update-stack" ]; then
  # wait for update operation to complete
  aws cloudformation wait stack-update-complete \
    --stack-name $StackName || true
fi

sleep 5

aws cloudformation describe-stacks \
  --stack-name $StackName \
  --query 'Stacks[].Outputs' \
  --output text