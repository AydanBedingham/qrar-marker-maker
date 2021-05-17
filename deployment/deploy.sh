#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
TEMP_DIR=$(mktemp -d -t ci-XXXXXXXXXX)

StackName="qrar"
ArtifactBucketName=temp-bucket123456
WebappVersion="LATEST"

$SCRIPT_DIR/build-frontend-artifact.sh "$TEMP_DIR/webapp.zip"
aws s3 cp "$TEMP_DIR/webapp.zip" "s3://$ArtifactBucketName/webapp/webapp_$WebappVersion.zip"

$SCRIPT_DIR/deploy-sam.sh u $StackName