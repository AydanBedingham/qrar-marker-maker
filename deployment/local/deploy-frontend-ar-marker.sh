#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
FRONTEND_DIR=$SCRIPT_DIR/../frontend

DEFAULT_STACK_NAME="qrar"
Region=us-east-1

set -e

if [ -n "$1" ]; then
  StackName=$1
else
  read -p "Enter the StackName [$DEFAULT_STACK_NAME]: " line
  StackName=${line:-`echo $DEFAULT_STACK_NAME`}
fi

FrontendDistributionId=$(aws cloudformation describe-stacks \
  --region $Region \
  --stack-name $StackName \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendDistributionId`].OutputValue' \
  --output text)
echo "FrontendDistributionId: $FrontendDistributionId"

FrontendBucketName=$(aws cloudformation describe-stacks \
  --region $Region \
  --stack-name $StackName \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text)
echo "FrontendBucketName: $FrontendBucketName"

FrontendUrl=$(aws cloudformation describe-stacks \
  --region $Region \
  --stack-name $StackName \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendUrl`].OutputValue' \
  --output text)
echo "FrontendUrl: $FrontendUrl"

# clear build directory
rm -r $FRONTEND_DIR/ar-marker/build/ || true

# change to ar-marker
cd $FRONTEND_DIR/ar-marker
npm run build

# sync files to s3 bucket
aws s3 sync $FRONTEND_DIR/ar-marker/build s3://$FrontendBucketName --delete

# invalidate cloudfront distribution
aws cloudfront create-invalidation \
    --distribution-id $FrontendDistributionId \
    --paths "/" "/*"

# print the distribution url
echo "CloudFront Url: https://$FrontendUrl"
