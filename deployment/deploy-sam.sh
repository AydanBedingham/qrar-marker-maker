#!/bin/bash
set -e

DEFAULT_STACK_NAME="qrar"
Region=us-east-1
S3bucket=temp-bucket123456

# show help
[ $# -eq 0 ] && echo "Usage: $0 action" && exit 1

# get act from argument 1
act=$1
case $act in
  c) Action=create-stack;;
  d) Action=delete-stack;;
  u) Action=update-stack;;
  *) echo "unknown action $act  valid actions are c, d, or u   Usage: $0 action" exit 1 ;;
esac

if [ -n "$2" ]; then
  StackName=$2
else
  read -p "Enter the StackName [$DEFAULT_STACK_NAME]: " line
  StackName=${line:-`echo $DEFAULT_STACK_NAME`}
fi


if [ "$Action" == "delete-stack" ]; then
    # delete from CloudFormation
    aws cloudformation $Action \
        --stack-name $StackName

    echo "Waiting for operation to complete..."

    sleep 5

    aws cloudformation wait stack-delete-complete \
      --region $Region \
      --stack-name $StackName

    exit 0
fi

# lint sam template
cfn-lint template.yaml

# create build directory of .aws-sam
sam build

# create zip from .aws-sam and upload zip to S3
sam package \
    --s3-bucket $S3bucket \
    --s3-prefix $StackName \
    --output-template-file .aws-sam/sam-template.tmp \
    --force-upload \
    --region $Region

# deploy to CloudFormation
aws cloudformation $Action \
    --stack-name $StackName \
    --template-body file://.aws-sam/sam-template.tmp \
    --parameters file://parameters.json \
    --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM \
    --region $Region

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

sleep 5

#print stack outputs

aws cloudformation describe-stacks \
  --region $Region \
  --stack-name $StackName \
  --query 'Stacks[].Outputs' \
  --output text