#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
FRONTEND_DIR=$SCRIPT_DIR/../frontend
TEMP_DIR=/tmp/qrar/play/play

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

PlayBucketName=$(aws cloudformation describe-stacks \
  --region $Region \
  --stack-name $StackName \
  --query 'Stacks[0].Outputs[?OutputKey==`PlayBucketName`].OutputValue' \
  --output text)
echo "PlayBucketName: $PlayBucketName"

FrontendUrl=$(aws cloudformation describe-stacks \
  --region $Region \
  --stack-name $StackName \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendUrl`].OutputValue' \
  --output text)
echo "FrontendUrl: $FrontendUrl"

# clear the temp directory
rm -r "$TEMP_DIR" || true
mkdir -p "$TEMP_DIR"

# copy play page to temp directory
cp -r "$FRONTEND_DIR/play/" "$TEMP_DIR/"

# unzip barcodes to temp directory
mkdir -p $TEMP_DIR/barcodes
unzip $FRONTEND_DIR/barcodes.zip -d $TEMP_DIR/barcodes

# sync files to s3 bucket
aws s3 sync $TEMP_DIR/../ s3://$PlayBucketName --delete

# invalidate cloudfront distribution
aws cloudfront create-invalidation \
    --distribution-id $FrontendDistributionId \
    --paths "/play" "/play/*"

# print the distribution url
echo "CloudFront Url: https://$FrontendUrl/play"
