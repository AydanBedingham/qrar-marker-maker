#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
TEMP_DIR=$(mktemp -d -t ci-XXXXXXXXXX)

# check for missing parameters
if [ $# -ne 3 ]
then
    echo "Invalid parameters"
    echo "Usage: $0 <Region> <ArtifactBucketName> <ArtifactBucketPrefix>"
    echo "Example: $0 us-east-1 temp-bucket123456 release/1.03"
    exit 1
fi

# get region
Region=$1

# get artifact bucket name
ArtifactBucketName=$2

# get artifact bucket prefix
ArtifactBucketPrefix=$3

# lint sam template
cfn-lint template.yaml

# build frontend artifacts
$SCRIPT_DIR/build-frontend-artifacts.sh "$TEMP_DIR/webapp.zip"

# upload build artifacts to bucket
FrontendArtifactBucketObject="$ArtifactBucketPrefix/webapp.zip"
aws s3 cp "$TEMP_DIR/webapp.zip" "s3://$ArtifactBucketName/$FrontendArtifactBucketObject"

# create build directory of .aws-sam
sam build

# create zip from .aws-sam and upload zip to S3
PackagedTemplatePath=.aws-sam/packaged-template.yaml
PackagedTemplateS3Object=$ArtifactBucketPrefix/packaged-template.yaml
sam package \
    --s3-bucket "$ArtifactBucketName" \
    --s3-prefix "$ArtifactBucketPrefix" \
    --output-template-file "$PackagedTemplatePath" \
    --region $Region \
    --force-upload
    
aws s3 cp "$PackagedTemplatePath" "s3://$ArtifactBucketName/$PackagedTemplateS3Object"

echo "Launch Stack URL:"
echo "https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?stackName=qrar&templateURL=https://$ArtifactBucketName.s3.amazonaws.com/$PackagedTemplateS3Object&param_FrontendArtifactBucketName=$ArtifactBucketName&param_FrontendArtifactBucketObject=$FrontendArtifactBucketObject"
